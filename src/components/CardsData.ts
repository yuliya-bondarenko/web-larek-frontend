import { ICard, ICardList, ICardsData } from "../types";
import { IEvents } from "./base/events";

class CardsData implements ICardsData {
    protected _cards: ICardList[]; //массив объектов карточек
    protected _prewiew: string | null; //id карточки, выбранной для просмотра
    protected events: IEvents; //экземпляр класса 'EventEmitter' для инициализации событий при изменении данных.

    constructor(events: IEvents) {
        this.events = events
    }

    set cards (cards: ICardList[]) {
        this._cards = cards;
        this.events.emit('cards:changed')
    }

    get cards () {
        return this._cards
    }

}