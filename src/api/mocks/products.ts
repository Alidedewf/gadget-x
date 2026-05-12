export type ID = string;

export interface PhoneModel {
  id: ID;
  brand: string;
  name: string;
}

export interface Product {
  id: ID;
  title: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  isUniversal: boolean;
  compatibleModels: ID[];
  rating: number;
  reviewsCount: number;
  description: string;
}

export const MOCK_PHONE_MODELS: PhoneModel[] = [
  { id: '1', brand: 'Apple', name: 'iPhone 15 Pro Max' },
  { id: '2', brand: 'Apple', name: 'iPhone 14 Pro Max' },
  { id: '3', brand: 'Apple', name: 'iPhone 13 Pro' },
  { id: '4', brand: 'Samsung', name: 'Galaxy S24 Ultra' },
  { id: '5', brand: 'Samsung', name: 'Galaxy S23+' },
];

export const MOCK_PRODUCTS: Product[] = [
  // ── ЧЕХЛЫ ────────────────────────────────────────
  {
    id: 'p1',
    title: 'Чехол Silicone Case с MagSafe',
    price: 3990,
    oldPrice: 5990,
    category: 'Чехлы',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1'],
    rating: 4.8,
    reviewsCount: 242,
    description: 'Оригинальный силиконовый чехол с поддержкой MagSafe. Мягкая внутренняя поверхность защищает заднюю крышку от царапин. Идеально садится и не скользит в руке.'
  },
  {
    id: 'p2',
    title: 'Чехол кожаный Premium + кармашек',
    price: 5200,
    oldPrice: 6800,
    category: 'Чехлы',
    image: 'https://images.unsplash.com/photo-1592896590393-27c5ce9ceffe?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2'],
    rating: 4.7,
    reviewsCount: 98,
    description: 'Натуральная итальянская кожа. Встроенный кармашек для карты. Поддерживает беспроводную зарядку через кожу толщиной 1.2 мм.'
  },
  {
    id: 'p3',
    title: 'Чехол прозрачный Magnetic Clear',
    price: 1490,
    category: 'Чехлы',
    image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2', '3'],
    rating: 4.5,
    reviewsCount: 376,
    description: 'Ультратонкий прозрачный чехол из поликарбоната. Не желтеет со временем. Встроенное кольцо-магнит для MagSafe-аксессуаров.'
  },
  {
    id: 'p4',
    title: 'Чехол-бумажник Samsung Leather Flip',
    price: 4400,
    category: 'Чехлы',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['4', '5'],
    rating: 4.6,
    reviewsCount: 61,
    description: 'Флип-кейс из экокожи для Galaxy S24 Ultra. Три кармашка для карт. Поддержка S-Pen. Магнитная застёжка.'
  },
  {
    id: 'p5',
    title: 'Чехол карбоновый с подставкой',
    price: 2790,
    oldPrice: 3500,
    category: 'Чехлы',
    image: 'https://images.unsplash.com/photo-1598327105854-3392c8d2e6cf?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['4'],
    rating: 4.4,
    reviewsCount: 33,
    description: 'Текстура под карбон + встроенная откидная подставка. Матовая поверхность не собирает отпечатки. Drop protection по стандарту MIL-SPEC.'
  },

  // ── СТЕКЛА ───────────────────────────────────────
  {
    id: 'p6',
    title: 'Защитное стекло Premium Glass 9H',
    price: 990,
    oldPrice: 1490,
    category: 'Защитные стёкла',
    image: 'https://images.unsplash.com/photo-1541560052-5e137f229371?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2'],
    rating: 4.5,
    reviewsCount: 511,
    description: 'Олеофобное покрытие, твёрдость 9H. Тонкость 0.26 мм — сенсор не теряет чувствительность. Рамка для идеального наклейки в комплекте.'
  },
  {
    id: 'p7',
    title: 'Стекло антишпион Privacy Glass',
    price: 1490,
    category: 'Защитные стёкла',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2', '3'],
    rating: 4.3,
    reviewsCount: 187,
    description: 'Экран виден только под прямым углом к вам. Боковые наблюдатели видят лишь чёрный экран. Идеально для работы в транспорте.'
  },
  {
    id: 'p8',
    title: 'Стекло матовое Anti-Glare',
    price: 1290,
    category: 'Защитные стёкла',
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['4', '5'],
    rating: 4.2,
    reviewsCount: 92,
    description: 'Матовое покрытие устраняет блики на солнце. Приятное тактильное ощущение как у бумаги. Подходит для работы с S-Pen.'
  },

  // ── ЗАРЯДКИ ──────────────────────────────────────
  {
    id: 'p9',
    title: 'Беспроводная зарядка 3-в-1 MagSafe',
    price: 4500,
    oldPrice: 6000,
    category: 'Зарядки',
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=600&q=80',
    isUniversal: true,
    compatibleModels: [],
    rating: 4.9,
    reviewsCount: 412,
    description: 'Заряжай iPhone, AirPods и Apple Watch одновременно. Мощность 15W для iPhone 12+. Сертификат Qi2. Складная конструкция для путешествий.'
  },
  {
    id: 'p10',
    title: 'GaN-зарядник 65W USB-C + USB-A',
    price: 3200,
    oldPrice: 4000,
    category: 'Зарядки',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
    isUniversal: true,
    compatibleModels: [],
    rating: 4.8,
    reviewsCount: 654,
    description: 'GaN-технология: в 2 раза меньше нагрева при той же мощности. 2 порта USB-C + 1 USB-A. Зарядит MacBook, iPad и iPhone одновременно.'
  },
  {
    id: 'p11',
    title: 'Автомобильный MagSafe держатель + зарядка 15W',
    price: 2990,
    category: 'Зарядки',
    image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2', '3'],
    rating: 4.6,
    reviewsCount: 221,
    description: 'Магнитный держатель на воздуховод + зарядка 15W. Подходит для iPhone 12 и новее. Один кабель USB-C в комплекте.'
  },
  {
    id: 'p12',
    title: 'Портативный аккумулятор 20000 mAh PD',
    price: 5990,
    oldPrice: 7500,
    category: 'Зарядки',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80',
    isUniversal: true,
    compatibleModels: [],
    rating: 4.7,
    reviewsCount: 849,
    description: '20 000 мАч, 2 USB-C + 1 USB-A. Power Delivery 20W для быстрого заряда. Встроенный дисплей уровня заряда. 4 полных заряда iPhone 15 Pro Max.'
  },

  // ── КАБЕЛИ ───────────────────────────────────────
  {
    id: 'p13',
    title: 'Кабель USB-C → USB-C 240W 2м плетёный',
    price: 1190,
    category: 'Кабели',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    isUniversal: true,
    compatibleModels: [],
    rating: 4.8,
    reviewsCount: 1022,
    description: 'Нейлоновая оплётка, 240W, USB 3.2 Gen 2. Передаёт видео 8K, данные 40 Гбит/с. Совместим с MacBook, iPad, Samsung, Nintendo Switch.'
  },
  {
    id: 'p14',
    title: 'Кабель Lightning → USB-C MFi 1м',
    price: 890,
    oldPrice: 1200,
    category: 'Кабели',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2', '3'],
    rating: 4.5,
    reviewsCount: 334,
    description: 'Сертификат MFi Apple. Быстрая зарядка до 27W. Силиконовая оплётка. Совместим со всеми iPhone до 2023 года.'
  },
  {
    id: 'p15',
    title: 'Кабель USB-C → Lightning 2м с подсветкой',
    price: 1390,
    category: 'Кабели',
    image: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['2', '3'],
    rating: 4.3,
    reviewsCount: 156,
    description: 'Встроенная LED-подсветка в разъёме мигает при зарядке. MFi-сертификация. 2 метра длины — удобно с кровати.'
  },

  // ── НАУШНИКИ ─────────────────────────────────────
  {
    id: 'p16',
    title: 'TWS наушники ANC Pro — 40ч без подзарядки',
    price: 8990,
    oldPrice: 12000,
    category: 'Наушники',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    isUniversal: true,
    compatibleModels: [],
    rating: 4.9,
    reviewsCount: 1876,
    description: 'Активное шумоподавление до -45 дБ. 8 часов от наушников + кейс 32 часа. Bluetooth 5.3, multipoint — подключение к двум устройствам одновременно.'
  },
  {
    id: 'p17',
    title: 'Чехол силиконовый для AirPods Pro 2',
    price: 890,
    category: 'Чехлы',
    image: 'https://images.unsplash.com/photo-1636741884985-beb0e6a39f1f?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2', '3'],
    rating: 4.4,
    reviewsCount: 203,
    description: 'Силиконовый чехол для AirPods Pro 2-го поколения. Карабин в комплекте. Поддерживает MagSafe зарядку через чехол.'
  },
  {
    id: 'p18',
    title: 'Наушники проводные USB-C Hi-Fi 32 Ω',
    price: 2490,
    category: 'Наушники',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '4', '5'],
    rating: 4.6,
    reviewsCount: 287,
    description: 'Hi-Fi звук через USB-C разъём. 32 Ом, 20Гц–20кГц. Встроенный ЦАП. Кабель 1.2м с микрофоном. Подходит для iPhone 15 и Samsung через Type-C.'
  },

  // ── УМНЫЕ АКСЕССУАРЫ ──────────────────────────────
  {
    id: 'p19',
    title: 'Кольцо-держатель MagSafe PopSocket',
    price: 1290,
    category: 'Подставки и держатели',
    image: 'https://images.unsplash.com/photo-1512867957657-38dbae50a35b?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2', '3'],
    rating: 4.5,
    reviewsCount: 418,
    description: 'Магнитное кольцо-подставка. Крепится к MagSafe без клея. Складывается до 4мм толщины. Угол обзора 0–120°.'
  },
  {
    id: 'p20',
    title: 'Настольная подставка с MagSafe 360°',
    price: 2190,
    oldPrice: 2990,
    category: 'Подставки и держатели',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    isUniversal: true,
    compatibleModels: [],
    rating: 4.7,
    reviewsCount: 134,
    description: 'Алюминиевая подставка с MagSafe. Регулировка угла 0–90°. Вращение 360°. Можно зарядить iPhone лёжа и стоя.'
  },
  {
    id: 'p21',
    title: 'Трекер Bluetooth AirTag-совместимый',
    price: 1790,
    category: 'Умные аксессуары',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&q=80',
    isUniversal: true,
    compatibleModels: [],
    rating: 4.4,
    reviewsCount: 92,
    description: '1 год работы от батарейки CR2032. Дальность Bluetooth 100м. Совместим с функцией "Найти" на iPhone. Водозащита IP67.'
  },
  {
    id: 'p22',
    title: 'Объектив-клип для камеры 3-в-1',
    price: 2990,
    oldPrice: 3990,
    category: 'Умные аксессуары',
    image: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?auto=format&fit=crop&w=600&q=80',
    isUniversal: true,
    compatibleModels: [],
    rating: 4.3,
    reviewsCount: 67,
    description: 'Набор: широкоугольный 120° + макро 20x + fisheye 230°. Универсальный клип подходит на любой смартфон. Прочный алюминиевый корпус.'
  },
  {
    id: 'p23',
    title: 'Стилус для iPad + iPhone заметки',
    price: 3490,
    category: 'Умные аксессуары',
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2'],
    rating: 4.5,
    reviewsCount: 145,
    description: 'Сверхчувствительный стилус с прозрачным наконечником 1.5мм. Заряжается от Lightning. Работает с Notes, Procreate, GoodNotes.'
  },
  {
    id: 'p24',
    title: 'Ремешок для Apple Watch Ultra плетёный',
    price: 2290,
    oldPrice: 2990,
    category: 'Умные аксессуары',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    isUniversal: false,
    compatibleModels: ['1', '2', '3'],
    rating: 4.7,
    reviewsCount: 389,
    description: 'Нейлоновый плетёный ремешок 49мм для Apple Watch Ultra/Series 9/8. Гипоаллергенный материал. Быстросъёмный механизм.'
  },
  {
    id: 'p25',
    title: 'Selfie-стик + трипод Bluetooth 105см',
    price: 1990,
    category: 'Подставки и держатели',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=80',
    isUniversal: true,
    compatibleModels: [],
    rating: 4.6,
    reviewsCount: 723,
    description: 'Раскладывается в трипод 26см или монопод 105см. Bluetooth-кнопка в рукоятке. Универсальный зажим 55–86мм. Нагрузка до 500г.'
  },
];
