import { handlePrice } from '../utils/utils';
import { Component } from './base/Component';

interface IModalSuccessActions {
  onClick: (event: MouseEvent) => void;
}

export interface IModalSuccess {
  price: number;
}

export class SuccessModal extends Component<IModalSuccess> {
  protected _button: HTMLButtonElement;
  protected _price: HTMLElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: IModalSuccessActions
  ) {
    super(container);

    this._button = container.querySelector(`.${blockName}__close`);
    this._price = container.querySelector(`.${blockName}__description`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      }
    }
  }

  set price(value: number) {
    this.setText(this._price, 'Списано ' + handlePrice(value) + ' синапсов');
  }
}
