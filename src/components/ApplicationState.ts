import { IAppFeelings, ICard, ErrorsForm, IBasketOrderForm, IBasketOrder } from '../types';
import { Model } from './base/Model';

export class ItemInShop extends Model<ICard> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

/*
  * Класс, описывающий состояние приложения
  * */
export class ApplicationState extends Model<IAppFeelings> {
  basket: ItemInShop[] = [];// Корзина с товарами
  store: ItemInShop[];// Массив со всеми товарами
  // Объект заказа клиента
  order: IBasketOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
  };
  formErrors: ErrorsForm = {};// Объект с ошибками форм

  addItemToBasket(value: ItemInShop) {
    this.basket.push(value);
  }

  deleteItemFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id)
  }

  clearBasket() {
    this.basket.length = 0;
  }

  amount() {
    return this.basket.length;
  }

  setItems() {
    this.order.items = this.basket.map(item => item.id)
  }

  setBasketOrderField(field: keyof IBasketOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateContactForm()) {
      this.events.emit('contacts:ready', this.order)
    }
    if (this.validateOrderForm()) {
      this.events.emit('order:ready', this.order);
    }
  }

  validateContactForm() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('contactsErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateOrderForm() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit('orderErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  clearBasketOrder() {
    this.order = {
      items: [],
      total: null,
      address: '',
      email: '',
      phone: '',
      payment: ''
    };
  }

  getTotalPrice() {
    return this.basket.reduce((sum, next) => sum + next.price, 0);
  }

  changingDataType(items: ICard[]) {
    this.store = items.map((item) => new ItemInShop({ ...item, selected: false }, this.events));
    this.emitChanges('items:changed', { store: this.store });
  }

  clearList() {
    this.store.forEach(item => item.selected = false)
  }
}
