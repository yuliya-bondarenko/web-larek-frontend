import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { View } from './components/View';
import { EventEmitter } from './components/base/events';
import { ModalWindow } from './components/common/ModalWindow';
import { PreviewItem, ShopItem } from './components/CardItem';
import { ApplicationState, ItemInShop } from './components/ApplicationState';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ApiResp, IBasketOrderForm, ICard } from './types';
import { API_URL } from './utils/constants';
import { BasketModal, BasketCard } from './components/BasketModal';
import { OrderUser } from './components/OrderUser';
import { ContactsForm } from './components/ContactsForm';
import { SuccessModal } from './components/SuccessModal';

const api = new Api(API_URL);
const events = new EventEmitter();

// Все шаблоны
const storeProductTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new ApplicationState({}, events);

// Глобальные контейнеры
const view = new View(document.body, events);
const modal = new ModalWindow(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты
const basket = new BasketModal('basket', cloneTemplate(basketTemplate), events);
const order = new OrderUser('order', cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new SuccessModal('order-success', cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close');
		modal.close();
	},
});

// Получаем лоты с сервера
api
	.get('/product')
	.then((res: ApiResp) => {
		appData.changingDataType(res.items as ICard[]);
	})
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
events.on('items:changed', () => {
	view.store = appData.store.map((item) => {
		const product = new ShopItem(cloneTemplate(storeProductTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открытие карточки
events.on('card:select', (item: ItemInShop) => {
	view.locked = true;
	const product = new PreviewItem(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:toBasket', item);
		},
	});
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			selected: item.selected,
		}),
	});
});

// Добавление товара в корзину
events.on('card:toBasket', (item: ItemInShop) => {
	item.selected = true;
	appData.addItemToBasket(item);
	view.counter = appData.amount();
	modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
	view.locked = true;
	const basketItems = appData.basket.map((item, index) => {
		const storeItem = new BasketCard(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => events.emit('basket:delete', item),
			}
		);
		return storeItem.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render({
			list: basketItems,
			price: appData.getTotalPrice(),
		}),
	});
});

// Удалить товар из корзины
events.on('basket:delete', (item: ItemInShop) => {
	appData.deleteItemFromBasket(item.id);
	item.selected = false;
	basket.price = appData.getTotalPrice();
	view.counter = appData.amount();
	basket.renderIndexes();
	if (!appData.basket.length) {
		basket.inactiveButton();
	}
});

// Оформить заказ
events.on('basket:order', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации заказа
events.on('orderErrors:change', (errors: Partial<IBasketOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось состояние валидации контактов
events.on('contactsErrors:change', (errors: Partial<IBasketOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменились введенные данные
events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof IBasketOrderForm; value: string }) => {
		appData.setBasketOrderField(data.field, data.value);
	}
);

// Заполнить телефон и почту
events.on('order:submit', () => {
	appData.order.total = appData.getTotalPrice();
	appData.setItems();
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

// Покупка товаров
events.on('contacts:submit', () => {
	api
		.post('/order', appData.order)
		.then((res) => {
			events.emit('order:success', res);
			appData.clearBasket();
			appData.clearBasketOrder();
			order.falseButton();
			view.counter = 0;
			appData.clearList();
		})
		.catch((err) => {
			console.log(err);
		});
});

// Окно успешной покупки
events.on('order:success', (res: ApiListResponse<string>) => {
	modal.render({
		content: success.render({
			price: res.total,
		}),
	});
});

// Закрытие модального окна
events.on('modal:close', () => {
	view.locked = false;
	appData.clearBasketOrder();
});
