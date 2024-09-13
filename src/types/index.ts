import { ItemInShop } from '../components/ApplicationState';

// Интерфейс, описывающий поля товара в магазине
export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CategoryTypes;
  price: number | null;
  selected: boolean;
}

// категории товара
export type CategoryTypes =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

export type CategoryKeys = {
  [Key in CategoryTypes]: string;
};

export interface ApiResp {
  items: ICard[];
}

// Интерфейс описывающий внутренне состояние приложения
export interface IAppFeelings {
  basket: ItemInShop[];// Корзина с товарами
  store: ItemInShop[];// Массив карточек товара
  order: IBasketOrder; // Информация о заказе при покупке товара
  formErrors: ErrorsForm;// Ошибки при заполнении форм
  addItemToBasket(value: ItemInShop): void;// Метод для добавления товара в корзину
  deleteItemFromBasket(id: string): void;// Метод для удаления товара из корзины
  clearBasket(): void;// Метод для полной очистки корзины
  amount(): number;// Метод для получения количества товаров в корзине
  getTotalPrice(): number;// Метод для получения суммы цены всех товаров в корзине
  setItems(): void;// Метод для добавления ID товаров в корзине в поле items для order
  setBasketOrderField(field: keyof IBasketOrderForm, value: string): void;// Метод для заполнения полей email, phone, address, payment в order
  validateContactForm(): boolean;// Валидация форм для окошка "контакты"
  validateOrderForm(): boolean;// Валидация форм для окошка "заказ"
  clearBasketOrder(): boolean;// Очистить order после покупки товаров
  changingDataType(items: ICard[]): void;// Метод для превращения данных, полученых с сервера в тип данных приложения
  clearList(): void;// Метод для обновления поля selected во всех товарах после совершения покупки
}

// тип, описывающий ошибки валидации форм
export type ErrorsForm = Partial<Record<keyof IBasketOrderForm, string>>;

//Интерфейс, описывающий поля заказа товара
export interface IBasketOrder {
  items: string[];
  payment: string;
  total: number;
  address: string;
  email: string;
  phone: string;
}

// Интерфейс, описывающий данные пользователя
export interface IBasketOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}
