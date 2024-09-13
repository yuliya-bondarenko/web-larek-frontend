import { IEvents } from './base/events';
import { ModalForm } from './common/ModalForm';

// Интерфейс, описывающий окошко контакты
export interface IContactsForm {
  phone: string;
  email: string;
}

//Класс, описывающий окошко контакты
export class ContactsForm extends ModalForm<IContactsForm> {
  // Ссылки на инпуты для телефона и электронной почты
  private _phoneInput: HTMLInputElement;
  private _emailInput: HTMLInputElement;

  // Конструктор принимает родительский элемент и обработчик событий
  constructor(
    container: HTMLFormElement,
    events: IEvents
  ) {
    super(container, events);

    this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;
    this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
  }

  // Сеттер для телефона
  set phone(value: string) {
    if (this._phoneInput) {
      this._phoneInput.value = value;
      this.inputChanging('phone', value);
    }
  }

  // Сеттер для электронной почты
  set email(value: string) {
    if (this._emailInput) {
      this._emailInput.value = value;
      this.inputChanging('email', value);
    }
  }
}