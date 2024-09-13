import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IForm {
  valid: boolean;
  errors: string[];
}

export class ModalForm<T> extends Component<IForm> {
  protected buttonSubmit: HTMLButtonElement;
  protected formErrors: HTMLElement;

  constructor(
    protected container: HTMLFormElement,
    protected events: IEvents,
  ) {
    super(container);

    this.buttonSubmit = ensureElement<HTMLButtonElement>(
      'button[type=submit]',
      this.container
    );
    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.inputChanging(field, value);
    });

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  //Обрабатывает изменение значения в полях формы и генерирует соответствующее событие.
  protected inputChanging(field: keyof T, value: string) {  
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field,
      value,
    });
  }

  //Устанавливает состояние кнопки отправки формы (активна/неактивна).
  set valid(value: boolean) {
    this.setDisabled(this.buttonSubmit, !value);
  }

  //Устанавливает сообщения об ошибках для отображения в форме
  set errors(value: string) {
    this.setText(this.formErrors, value);
  }

  //Рендерит форму с указанным состоянием, обновляя значения полей и отображая ошибки.
  render(state: Partial<T> & IForm) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}
