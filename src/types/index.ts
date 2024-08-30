//интерфейс для карточки
export interface ICard {
    id: number;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

//интерфейс для заказа
export interface IOrder {
    payment: TOrderPayment;
    email: string;
    phone: string;
    address: string;
    items: IModalOrder[];
}

//интерфейс для модели данных карточек
export interface ICardsData {
    cards: ICardList[];
    prewiew: string | null;//указатель на картинку через id
    deleteCard(cardId: string, payload: Function | null): void;
    getCard(cardId:string): ICard;//ICardList?
}

//интерфейс для модели данных полученных от пользователя
export interface IOrderData {
    item(CardId: number): IModalOrder | null;
    getBasketPrice(): number;// Получение цены позиций в корзине
    getItemsLength(): number;//получение колличества позиций в корзине
    getOrderInfo(): IModalOrder[];
    setOrderInfo<T>(orderData: T): void;
    checkValidation( data: Record<keyof Pick<IOrder, "email" | "phone" | "address">, string>): boolean;
}

export type TOrderPayment = 'cash' | 'card'// для описания возможных способов оплаты заказа

export type ICardList = Omit<ICard, "description">// интерфейс списка карточек для главной страницы

export type IModalOrder = Pick<ICard, "id" |"title" | "price">//интерфейс карточки товара в корзине

export type IModalAddress = Pick<IOrder, "payment" | "address">//интерфейс формы оплаты и доставки

export type IModalEmail = Pick<IOrder, "email" | "phone">//интерфейс формы почты и телефона
