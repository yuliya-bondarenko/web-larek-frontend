import { Component } from './base/Component';
import { CategoryTypes } from '../types';
import { ensureElement, handlePrice } from '../utils/utils';
import { CDN_URL } from '../utils/constants';
import { categoryKeys } from '../utils/constants';

interface ICardActionsFunctions {
  onClick: (event: MouseEvent) => void;
}

export interface ICardItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}

export class CardItem extends Component<ICardItem> {
  // Ссылки на внутренние элементы карточки
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский контейнер
  // и объект с колбэк функциями
  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardActionsFunctions
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(
      `.${blockName}__image`,
      container
    );
    this._button = container.querySelector(`.${blockName}__button`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = container.querySelector(`.${blockName}__price`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  // Сеттер и геттер для id карточки
  set id(value: string) {
    this.container.dataset.id = value;
  }
  get id(): string {
    return this.container.dataset.id || '';
  }

  // Сеттер и гетер для названия
  set title(value: string) {
    this.setText(this._title, value);
  }
  get title(): string {
    return this._title.textContent || '';
  }

  // Сеттер для кратинки
  set image(value: string) {
    this._image.src = CDN_URL + value;
  }

  // Сеттер для определения выбрали товар или нет
  set selected(value: boolean) {
    if (this._button && !this._button.disabled) {
      this.setDisabled(this._button, value);
    }
  }

  // Сеттер для цены
  set price(value: number | null) {
    this.setText(
      this._price,
      value ? handlePrice(value) + ' синапсов' : 'Бесценно'
    );
    if (this._button && !value) {
      this.setDisabled(this._button, true);
    }
  }

  // Сеттер для категории
  set category(value: CategoryTypes) {
    this.setText(this._category, value);
    this.toggleClass(this._category, categoryKeys[value], true);
  }
}

export class ShopItem extends CardItem {
  constructor(container: HTMLElement, actions?: ICardActionsFunctions) {
    super('card', container, actions);
  }
}

export class PreviewItem extends CardItem {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActionsFunctions) {
    super('card', container, actions);

    this._description = container.querySelector(`.${this.blockName}__text`);
  }

  set description(value: string) {
    this.setText(this._description, value);
  }
}