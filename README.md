# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемых в приложении

Карточка

```
export interface ICard {
    id: number;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```

Заказ

```
export interface IOrder {
    payment: TOrderPayment;
    email: string;
    phone: string;
    address: string;
    items: IModalOrder[];
}
```

Интерфейс для модели данных карточек

```
export interface ICardsData {
    cards: ICardList[];
    prewiew: string | null;//указатель на картинку через id
    deleteCard(cardId: string, payload: Function | null): void;
    getCard(cardId:string): ICard;//ICardList?
}
```

интерфейс для модели данных полученных от пользователя

export interface IOrderData {
    item(CardId: number): IModalOrder | null
    getBasketPrice(): number;// Получение цены позиций в корзине
    getItemsLength(): number;//получение колличества позиций в корзине
    getOrderInfo(): IModalOrder[];
    setOrderInfo<T>(orderData: T): void;
    checkValidation( data: Record<keyof Pick<IOrder, "email" | "phone" | "address">, string>): boolean;
}


интерфейс списка карточек для главной страницы

```
export type ICardList = Omit<ICard, "description">
```

интерфейс возможных способов оплаты заказа

```
export type TOrderPayment = 'cash' | 'card'
```

интерфейс карточки товара в корзине

```
export type IModalOrder = Pick<ICard, "id" |"title" | "price">
```

интерфейс формы оплаты и доставки

```
export type IModalAddress = Pick<IOrder, "payment" | "address">
```

интерфейс формы почты и телефона

```
export type IModalEmail = Pick<IOrder, "email" | "phone">
```

## Архитектура

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображения данных на странице,
- слой данных, отвечает за хранение и изменение данных,
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправи запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- 'get' - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- 'post' - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт, переданный как параментр при вызове метода. По умолчанию выполняется 'POST' запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий  и в слоях приложения для генерации событий.
Основные методы, реализуемые классом, описаны интерфейсом 'IEvents':
- 'on' - подписка на событие
- 'emit' - инициализация события
- 'trigger' - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс CardsData
Класс отвечает за хранение и логику работы с данными карточек.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- _cards: ICardList[] - массив объектов карточек
- _prewiew: string | null - id карточки, выбранной для просмотра
- events: IEvents - экземпляр класса 'EventEmitter' для инициализации событий при изменении данных.

 методы:
- deleteCard(cardId: string, payload: Function | null): void - удаляет карточку из корзины. Если передан колбек, то выполняет его после удаления, если нет, то вызывает событие изменения массива карточек в корзине.
- getCard(cardId:string): ICard - возвращает карточку по ее id.\
Также в классе будут сеттеры и геттеры для получения данных из полей класса

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.\
Конструктор класс принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- payment: string - способ оплаты лота
- email: string - адрес электронной почты
- phone: string - номер телефона
- address: string - почтовый адрес для отправки лотов
- _item(CardId: number): IModalOrder | null - товар, выбранный для покупки
- events: IEvents - экземпляр класса 'EventEmitter' для инициализации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными:
- getBasketPrice(): number; - получение цены позиций в корзине
- getItemsLength(): number; - получение колличества позиций в корзине(метод, который будет возвращать длину массива)
- getOrderInfo(): IModalOrder[] - возвращает массив выбранных элементов
- setOrderInfo<T>(orderData: T): void - сохраняет данные пользователя после заполнения одной из форм в модальном окне
- checkValidation( data: Record<keyof Pick<IOrder, "email" | "phone" | "address">, string>): boolean - проверяет объект с данными пользователя на валидность

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно, путем подстановки в разметку готового контейнера со своей разметкой и содержимым. Также предоставляет методы 'open' и 'close' для отображения модального окна. Устанавливает слушатели для закрытия модального окна по оверлею и по кнопке-крестик для закрытия попапа.
- constructor(selector: string, events: IEvents, template: templateElement) - конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно, темплейт нужного модально окна и экземпляр класса 'EventEmitter' для возможности инициализации событий.

Поля класса:
- modalElement: HTMLElement - элемент модального окна, блок в разметке, куда подставляется темплейт
- divElement: HTMLElement - готовый блок разметки HTML, который будет отображаться в модальном окне
- events: IEvents - брокер событий

методы:
- content(value: HTMLElement): void - Устанавливает содержимое модального окна.

#### Класс ModalCard
Предназначен для реализации модального окна открытие карточки товара. При открытии модального окна получает данные о карточке, которую нужно показать.\
Поля класса:
- submitButton: HTMLButtonElement - кнопка перемещения товара в корзину
- CardId: string - id выбранной карточки

Методы:
- toggleValid(isValid: boolean): void - изменяет активность надпись на кнопке с 'В корзину' на 'Удалить из корзины' и наоборот при удалении товара из корзины
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, который передается при инициализации события подтверждения.

#### Класс ModalBasket
Предназначен для показа содержимого корзины. 
Поля класса:
- submitButton: HTMLButtonElement - кнопка перемещения товара в корзину
- cards: HTMLCollection - список карточек, выбранных для покупки
- totalPrice: HTMLElement - элемент разметки для вывода общей стоимости товаров в корзине

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- set cards: IModalOrder[] - сохранить список выбранных пользователем товаров

#### Класс ModalForm
Предназначен для реализации модального окна с формой содержащей поля ввода, представляющий их общий функционал. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.\
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- errors: Record<string, HTMLElement> - объект хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- setError(data: { field: string, value: string, validInformation: string }): void - принимает объект с данными для отображения или сокрытия текстов ошибок под полями ввода
- hideInputError (field: string): void - очищает текст ошибки под указанным полем ввода
- resetform (): void - при закрытии формы очищает поля формы и деактивирует кнопку сохранения
- get form: HTMLElement - геттер для получения элемента формы

#### Класс FormAdress
Дочерний класс от ModalForm. Нужен для установки данных пользователя при оформлении заказа: способ оплаты и адрес доставки.
Поля класса:
- inputElement: HTMLInputElement - находит поле инпута в разметке для установки адреса доставки
- buttonCash: HTMLButtonElement - кнопка для выбора оплаты наличными
- buttonOnline: HTMLButtonElement - кнопка для выбора оплаты безналичными

методы:
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputValues(data: Record<string, string>): void - принимает объект с данными для заполнения поля адрес
- changeButton(isValid:boolean):void - Дает возможность выбрать только одну кнопку либо нал либо безнал
- setButtonValues(value: TOrderPayment): void - устанавливает значение оплаты выбранное пользователем

#### Класс FormEmail
Дочерний класс от ModalForm. Нужен для установки данных пользователя при оформлении заказа: электронная почта и телефон.
Поля класса:
- inputElement: HTMLInputElement - находим 2 поля инпута в разметке для установки электронного адреса и телефона

методы:
- getInputsValues(): Record<string, string>[] - возвращает объекты с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputsValues(data: Record<string, string>[]): void - принимает объект с данными для заполнения полей почта и телефонный номер

#### Класс ModalSuccess
Предназначен для реализации модального окна подтверждения успешной покупки.\
Поля класса:
- button: HTMLButtonElement - Кнопка перехода по ссылке на другую страницу

#### Класс Card
Отвечает за отображение карточки, задавая в карточке данные названия, изображения, описания, цены, категории. Класс используется для отображения карточек на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы:
- setData(cardData: ICard, userId: string): void - заполняет атрибуты элементов карточки данными.
- deleteCard(): void - метод для удаления разметки карточки
- render(): HTMLElement - метод возвращает полностью заполненную карточку
- геттер id возвращает уникальный id карточки
- deleteButton: HTMLButtonElement - кнопка удаления товара из корзины

#### Класс CardsContainer
Отвечает за отображение блока с карточками на главной странице. Предоставляет метод геттер `container` для полного обновления содержимого. В конструктор принимает контейнер, в котором размещаются карточки.

#### Класс Basket
Отвечает за блок сайта с корзиной. Принимает в конструктор контейнер - элемент разметки корзины на главной странице и экземпляр `EventEmitter` для инициации событий при нажатии пользователем на кнопки. Устанавливает в конструкторе слушатель на все кнопки покупки в карточках, при срабатывании которых генерируется новое отображение колличества товаров в корзине\
Поля класса:
- _items: HTMLElement - строка в разметке для отображения кол-ва товаров в корзине
- button: HTMLButtonElement - Кнопка перехода в корзину с главной страницы
- events: IEvents - брокер событий
Методы:
- setBasketItems(items: number, handleSubmit: Function): void - устанавливает кол-во товаров в корзине, на основании данных от EventEmitter.
- open(event): void - открывает корзину при нажатии на нее с главной страницы

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `basket:changed` - изменение данных пользователя
- `cards:changed` - изменение массива карточек
- `card:selected` - карточка выбрана
- `card:previewClear` - необходима очистка данных выбранной для показа в модальном окне карточки

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `card:select` - выбор карточки для отображения в модальном окне
- `card:open` - открытие модального окна с данными карточки товара
- `basket:open` - открытие модального окна корзины
- `card:delete` - выбор карточки для удаления из корзины
- `userAdress:open` - открытие модального окна с формой заполнения данных адреса доставки и способа оплаты
- `userEmail:open` - открытие модального окна с формой заполнения данных электронной почты и способа оплаты
- `modalSuccess:open` - открытие модального окна успешной покупки
- `modalSuccess:gotopage` - переход на главную страницу при клине по кнопке модального окна

- `payment:onlane` - выбор пользователем оплаты онлайн
- `payment:cash` - выбор пользователем оплаты при получении
- `address:input` - изменение адреса в форме с данными пользователя
- `email:input` - изменение данных в форме с электронной почтой
- `tel:input` - изменение данных в форме с телефонным номером

- `card:submit` - отправка карточки в корзину при нажатии кнопки "В корзину" из корточки товара
- `basket:submit` - отправка данных по выбранным товарам при нажати на кнопку "Оформить"
- `userAdress:submit` - сохранение данных пользователя payment и address в модальном окне
- `userEmail:submit` - сохранение данных пользователя email и phone в модальном окне

- `userAdress:validation` - событие, сообщающее о необходимости валидации формы с данными payment и address
- `userEmail:validation` - событие, сообщающее о необходимости валидации формы с данными email и phone