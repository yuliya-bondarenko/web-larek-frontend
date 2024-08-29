//интерфейс для карточки
export interface ICard {
    id: number;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

//интерфейс для заказа
export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: number | null;
}

export interface ICardsData {
    cards: ICardList[];
    prewiew: string | null;//указатель на картинку через id
    openModalCard(cardId: string): void;
    addCard(card: ICard): void;
    deleteCard(cardId: string, payload: Function | null): void;
    updateCard(card: ICard, payload: Function | null): void;
    getCard(cardId:string): ICard;//ICardList?
}

export interface IOrderData {
    getOrderInfo(): IModalOrder[];
    setOrderInfo<T>(orderData: T): void;
    checkValidation( data: Record<keyof Pick<IOrder, "email" | "phone" | "address">, string>): boolean;
}

export type ICardList = Omit<ICard, "description">// интерфейс списка карточек для главной страницы

export type IOrderTotal = Pick<IOrder, "items">//интерфейс счетачика корзины

export type IModalOrder = Pick<ICard, "id" |"title" | "price"> & Pick<IOrder, "total">//интерфейс корзины

export type IModalAddress = Pick<IOrder, "payment" | "address">//интерфейс формы оплаты и доставки

export type IModalEmail = Pick<IOrder, "email" | "phone">//интерфейс формы почты и телефона
