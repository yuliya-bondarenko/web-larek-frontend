import { ICard } from '../types/index';
import { handlePrice, ensureAllElements} from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

// Интерфейс, описывающий корзину товаров
export interface IBasketModal {
  list: HTMLElement[];// Массив элементов li с товаром
  price: number;// Общая цена товаров
}

// Класс, описывающий корзину товаров
export class BasketModal extends Component<IBasketModal> {
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _index: HTMLSpanElement[];

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(
    protected blockName: string,
    container: HTMLElement,
    protected events: IEvents
  ) {
    super(container);

    this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement;
    this._price = container.querySelector(`.${blockName}__price`) as HTMLElement;
    this._list = container.querySelector(`.${blockName}__list`) as HTMLElement;

    if (this._button) {
      this._button.addEventListener('click', () => this.events.emit('basket:order'));
    }
  }

  // Сеттер для общей цены
  set price(price: number) {
    this.setText(this._price, handlePrice(price) + ' синапсов');
  }

  // Сеттер для списка товаров 
  set list(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
    this.setDisabled(this._button, items.length === 0);
  }

  // Метод отключающий кнопку "Оформить"
  inactiveButton() {
    this.setDisabled(this._button, true);
  }

  // Метод для обновления индексов таблички при удалении товара из корзины
  renderIndexes(data?: Partial<IBasketModal>): HTMLElement {
    this._index = ensureAllElements<HTMLSpanElement>('.basket__item-index', this.container);

    this._index.forEach( (item, index) => {
      this.setText(item, String(index+1))
    })

    return super.render(data);
  }
}

export interface IBasketCard extends ICard {
  id: string;
  index: number;
  setIndex: (number: number) => void;
}

export interface IShopCardActions {
  onClick: (event: MouseEvent) => void;
}

// Класс, описывающий элемент корзины
export class BasketCard extends Component<IBasketCard> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: IShopCardActions
  ) {
    super(container);

    this._title = container.querySelector(`.${blockName}__title`) as HTMLElement;
    this._index = container.querySelector(`.basket__item-index`) as HTMLElement;
    this._price = container.querySelector(`.${blockName}__price`) as HTMLElement;
    this._button = container.querySelector(`.${blockName}__button`) as HTMLButtonElement;

    if (this._button) {
      this._button.addEventListener('click', (evt) => {
        this.container.remove();
        actions?.onClick(evt);
      });
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set index(value: number) {
    this.setText(this._index, value.toString());
  }

  set price(value: number) {
    this.setText(this._price, handlePrice(value) + ' синапсов');
  }
}
