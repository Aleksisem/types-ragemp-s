/// <reference path="enums.d.ts" />
/// <reference path="ped_hashes.d.ts" />
/// <reference path="vehicle_hashes.d.ts" />
/// <reference path="weapon_hashes.d.ts" />

// -------------------------------------------------------------------------
// Custom types
// -------------------------------------------------------------------------

type HashOrString = number | string;
type RGB = [ number, number, number ];
type RGBA = [ number, number, number, number ];
type Array2d = [ number, number ];
type Array3d = [ number, number, number ];
type Array4d = [ number, number, number, number ];
type KeyValueCollection = { [key: string]: any };

// -------------------------------------------------------------------------
// Main MP type
// -------------------------------------------------------------------------

interface Mp {
  blips: BlipMpPool;
  checkpoints: CheckpointMpPool;
  colshapes: ColshapeMpPool;
  dummies: DummyEntityMpPool;
  events: EventMpPool;
  labels: TextLabelMpPool;
  markers: MarkerMpPool;
  peds: PedMpPool;
  pickups: PickupMpPool;
  players: PlayerMpPool;
  objects: ObjectMpPool;
  vehicles: VehicleMpPool;
  config: ConfigMp,
  network: NetworkMp;
  world: WorldMp;

  Event: { 
    new(eventName: RageEnums.EventKey | string, callback: (...args: any[]) => void): EventMp 
  };
  Vector3: Vector3Mp;

	/**
	 * Генерирует хэш, используя строку
	 * @param str исходная строка
	 * @return хэш (целое число).
	 */
	joaat(str: string): number;
	/**
	 * Генерирует массив хэшей, используя массив строк
	 * @param strs массив строк
	 * @return массив хэшей (целые числа)
	 */
  joaat(strs: string[]): number[];
}

// -------------------------------------------------------------------------
// Entity MP types
// -------------------------------------------------------------------------

/**
 * Представляет объект метки на карте.
 */
interface BlipMp extends EntityMp {
  color: number;
  name: string;
  drawDistance: number;
  rotation: number;
  scale: number;
  shortRange: boolean;
  sprite: number;

	/**
	 * Создаёт маршрут к метке от местоположения игрока.
	 * @remarks
	 * Доступные цвета маршрутов описаны [здесь](https://wiki.rage.mp/index.php?title=Blips#Blip_colors).
	 * @param player игрок
	 * @param color цвет маршрута
	 * @param scale масштаб
	 */
	routeFor(player: PlayerMp | undefined, color: number, scale: number): void;
	/**
	 * Создаёт маршрут к метке для нескольких игроков.
	 * @remarks
	 * Доступные цвета маршрутов описаны [здесь](https://wiki.rage.mp/index.php?title=Blips#Blip_colors).
	 * @param players массив игроков
	 * @param color цвет маршрута
	 * @param scale масштаб
	 */
	routeFor(players: PlayerMp[] | undefined, color: number, scale: number): void;
	/**
	 * Удаляет маршрут к метке для игрока.
	 * @param player игрок
	 */
	unrouteFor(player: PlayerMp): void;
	/**
	 * Удаляет маршрут к метке для нескольких игроков.
	 * @param players массив игроков
	 */
  unrouteFor(players: PlayerMp[]): void;
}

/**
 * Представляет объект контрольной точки (чекпоинта).
 */
interface CheckpointMp extends EntityMp {
  color: number;
  destination: Vector3Mp;
  radius: number;
  visible: boolean;

  /**
   * Получает цвет чекпоинта в палитре rgba.
   * @return массив из 4 цветов (красный, зелёный, синий, альфа), от 0 до 255.
   * 
   * @example
   * ```typescript
   * const checkpoint = mp.checkpoints.new(2, new mp.Vector3(10, 10, 72), new mp.Vector3(), 4, 150, 255, 255, 255, true);
   * const color = checkpoint.getColor();
   * 
   * console.log(color); // -> [150, 255, 255, 255]
   * console.log(color[0]); // -> 150
   * ```
   */
  getColor(): number[];
  /**
   * Скрывает чекпоинт для указанного игрока.
   * @param player игрок
   */
  hideFor(player: PlayerMp): void;
  /**
   * Устанавливает цвет чекпоинта
   * @param {number} red значение красного цвета (от 0 до 255)
   * @param {number} green значение зелёного цвета (от 0 до 255)
   * @param {number} blue значение синего цвета (от 0 до 255)
   * @param {number} alpha значение прозрачности (от 0 до 255)
   */
  setColor(red: number, green: number, blue: number, alpha: number): void;
  /**
   * Отображает чекпоинт для указанного игрока.
   * @param player игрок
   */
  showFor(player: PlayerMp): void;
}

interface ColshapeMp extends EntityMp {
  readonly shapeType: RageEnums.ColshapeType;
  /**
   * Проверяет, находится ли точка в зоне коллизии
   * @param point точка
   * @return результат проверки (true - точка в зоне)
   */
  isPointWithin(point: Vector3Mp): boolean;
}

interface DummyEntityMp {
  dummyType: number;
}

/**
 * Представляет сущность.
 */
interface EntityMp {
  alpha: number;
  data: any;
  dimension: number;
  model: number;
  position: Vector3Mp;
  readonly id: number;
  readonly type: RageEnums.EntityType;
  
  /**
   * Получает значение пользовательской переменной сущности
   * @param name название переменной
   * @return содержание переменной
   */
  getVariable(name: string): any | undefined;
  /**
   * Уничтожает созданную сущность
   */
  destroy(): void;
  /**
   * Получает расстояние между сущностью и точкой в пространстве
   * @param position координаты второго объекта
   * @return растояние в метрах
   */
  dist(position: Vector3Mp): number;
  /**
   * Получает квадрат расстояния между сущностью и точкой в пространстве
   * @param position координаты второго объекта
   * @return квадрат расстояния в метрах
   */
  distSquared(position: Vector3Mp): number;
  /**
   * Устанавливает значение пользовательской переменной сущности
   * @param name название переменной
   * @param value содержание
   */
  setVariable(name: string, value: any): void;
  /**
   * Устанавливает значения нескольких пользовательских переменных сущности
   * @param values объект наборов названий переменных и их значений
   */
  setVariables(values: KeyValueCollection): void;
}

/**
 * Представляет объект маркера.
 */
interface MarkerMp extends EntityMp {
  direction: Vector3Mp;
  scale: number;
  visible: boolean;

	/**
	 * Получает цвет маркера в формате rgba
	 * @return массив из 4 цветов (красный, зелёный, синий, альфа), от 0 до 255.
	 */
	getColor(): number[];
	/**
	 * Скрыть маркер от игрока
	 * @param player игрок
	 */
	hideFor(player: PlayerMp): void;
	/**
	 * Установить цвет маркера.
	 * @param {number} red значение красного цвета (от 0 до 255)
   * @param {number} green значение зелёного цвета (от 0 до 255)
   * @param {number} blue значение синего цвета (от 0 до 255)
   * @param {number} alpha значение прозрачности (от 0 до 255)
	 */
	setColor(red: number, green: number, blue: number, alpha: number): void;
	/**
	 * Показать маркер игроку.
	 * @param player игрок
	 */
  showFor(player: PlayerMp): void;
}

/**
 * Представляет объект NPC.
 */
interface PedMp extends EntityMp {
  controller: PlayerMp;
}

/**
 * Представляет объект.
 */
interface ObjectMp extends EntityMp {
  rotation: Vector3Mp;
}

/**
 * Представляет объект пикапа.
 */
interface PickupMp extends EntityMp {
  pickupHash: number;
}

/**
 * Представляет объект игрока.
 */
interface PlayerMp extends EntityMp {
  armour: number;
  eyeColor: number;
  gameType: string;
  heading: number;
  health: number;
  name: string;
  weapon: number;
  weaponAmmo: number;
  disableOutgoingSync: boolean;
  readonly action: string;
  readonly aimTarget: PlayerMp;
  readonly allWeapons: number[];
  readonly ip: string;
  readonly isAiming: boolean;
  readonly isClimbing: boolean;
  readonly isEnteringVehicle: boolean;
  readonly isInCover: boolean;
  readonly isInMelee: boolean;
  readonly isJumping: boolean;
  readonly isLeavingVehicle: boolean;
  readonly isOnLadder: boolean;
  readonly isReloading: boolean;
  readonly hairColor: number;
  readonly hairHighlightColor: number;
  readonly packetLoss: number;
  readonly ping: number;
  readonly rgscId: string;
  readonly seat: RageEnums.VehicleSeat;
  readonly serial: string;
  readonly socialClub: string;
  readonly streamedPlayers: PlayerMp[];
  readonly weapons: PlayerWeaponCollectionMp;
  readonly vehicle: VehicleMp;
  readonly voiceListeners: PlayerMp[];

  /**
   * Банит игрока на сервере.
   * 
   * @remarks
   * Причина бана не отображается игроку. Кроме того, все баны, установленные данной функцией, снимаются после перезагрузки сервера.
   * @param reason причина
   */
  ban(reason: string): void;
  /**
   * Вызывает событие на стороне клиента указанного игрока.
   * @param eventName название события
   * @param args массив аргументов, которые нужно отправить клиенту
   * 
   * @example
   * ```typescript
   * player.call(`disablePlayerRegeneration`, [playerHealth]);
   * ```
   */
  call(eventName: string, args?: any[]): void;
  /**
   * Вызывает событие удалённого вызова процедуры (RPC) на стороне клиента указанного игрока и принимает обратный вызов.
   * @param eventName название события
   * @param args массив аргументов, которые нужно отправить клиенту
   * @return функция обратного вызова
   */
  callProc(eventName: string, args?: any[]): Promise<any>;
  /**
   * Вызывает событие на стороне клиента указанного игрока с возможными потерями пакетов.
   * @remarks Вызов запускается быстрее, что полезно, если вызовы нужно совершать часто.
   * @param eventName название события
   * @param args массив аргументов, которые нужно отправить клиенту
   */
  callUnreliable(eventName: string, args?: any[]): void;
  cancelPendingRpc(procName?: string): void;
  /**
   * Убирает все татуировки (украшения) с игрока.
   */
  clearDecorations(): void;
  /**
   * Отключает голосовое прослушивание игрока.
   * @param targetPlayer игрок, которого вы хотите прекратить слушать
   */
  disableVoiceTo(targetPlayer: PlayerMp): void;
  /**
   * Выполняет полученный код программы.
   * @param code код
   */
  eval(code: string): void;
  /**
   * Включает голосовое прослушивание игрока.
   * @param targetPlayer игрок, которого вы хотите слушать
   */
  enableVoiceTo(targetPlayer: PlayerMp): void;
  forceStreamingUpdate(): void;
  /**
   * Возвращает хеш одежды игрока.
   * @param component компонент
   * @return объект (id одежды, id текстуры, id цветовой палитры)
   */
  getClothes(component: RageEnums.ClothesComponent | number): {
    drawable: number,
    texture: number,
    palette: number
  };
  /**
   * Получает татуировку (украшение) игрока.
   * @param collection набор татуировок
   * @return id татуировки
   */
  getDecoration(collection: number): number;
  /**
   * Получает параметр черты лица, например, длину носа или форму подбородка.
   * @param index черта лица
   * @return параметр черты лица (от -1.0 до 1.0)
   */
  getFaceFeature(index: RageEnums.FaceFeature | number): number;
  /**
   * Получить параметры внешности (наследственности).
   * @return объект, содержащий следующие значения:
   * - массив параметров форм лица матери и отца
   * - массив параметров кожи матери и отца
   * - значение смешения параметров форм лица от 0.0 (Мать) до 1.0 (Отец)
   * - значение смешения параметров кожи от 0.0 (Мать) до 1.0 (Отец)
   * - неизвестно
   */
  getHeadBlend(): {
    shapes: number[],
    skins: number[],
    shapeMix: number,
    skinMix: number,
    thirdMix: number
  };
  getHeadBlendPaletteColor(type: 0 | 1 | 2 | 3): Array3d;
  /**
   * Получает детали лица (недостатки) или макияж.
   * @param overlay деталь лица
   * @return массив, содержащий тип детали, основной цвет, дополнительный цвет и прозрачность
   */
  getHeadOverlay(overlay: RageEnums.HeadOverlay | number): Array4d;
  /**
   * Получить значение общей для игроков переменной.
   * @param key название переменной
   * @return значение переменной
   * @beta
   */
  getOwnVariable(key: string): any;
  /**
   * Получает объект аксессуара игрока.
   * @param prop тип аксессуара
   * @return объект, содержащий элемент аксессуара и текстуру
   */
  getProp(prop: RageEnums.PlayerProp | number): {
    drawable: number,
    texture: number
  };
  /**
   * Получает количество боеприпасов указанного оружия.
   * @param weapon тип оружия
   * @return количество боеприпасов
   */
  getWeaponAmmo(weapon: RageEnums.Hashes.Weapon | HashOrString): number;
  /**
   * Выдаёт оружие игроку
   * @param weaponHash название оружия
   * @param ammo количество боеприпасов
   */
  giveWeapon(weaponHash: RageEnums.Hashes.Weapon | HashOrString, ammo: number): void;
  /**
   * Выдаёт набор оружий игроку
   * @param weaponHashes массив названий оружий
   * @param ammo количество боеприпасов
   */
  giveWeapon(weaponHashes: (RageEnums.Hashes.Weapon | HashOrString)[], ammo: number): void;
  hasPendingRpc(procName?: string): boolean;
  /**
   * Проверяет, находится ли игрок в зоне видимости другого игрока или нет.
   * @param player игрок в потенциальной зоне видимости
   * @return результат проверки (true - игрок находится в зоне видимости)
   */
  isStreamed(player: PlayerMp): boolean;
  /**
   * Вызывает указанную нативную функцию.
   * @param hash хеш функции
   * @param args аргументы
   */
  invoke(hash: string, ...args: any[]): void;
  /**
   * Кикает игрока с сервера.
	 * @remarks 
	 * причина кика не будет показана игроку.
   * @param reason причина
   */
	kick(reason: string): void;
	/**
	 * Кикает игрока с возможностью быстрого переподключения.
	 * @remarks
	 * Клиент будет вести себя так, как будто у него истекло время ожидания.
	 */
	kickSilent(): void;
	/**
	 * Отправляет уведомление игроку.
	 * @remarks 
	 * Вы можете использовать следующие [коды](https://wiki.rage.mp/index.php?title=Fonts_and_Colors) цветов и шрифта.
	 * @param message сообщение
	 */
	notify(message: string): void;
	/**
	 * Отправляет сообщение игроку в чат.
	 * @param message текст сообщения
	 */
	outputChatBox(message: string): void;
	/**
	 * Запускает анимацию.
	 * @remarks
	 * Список анимаций можно просмотреть [здесь](https://wiki.rage.mp/index.php?title=Animations).
	 * Флаги анимации:
	 * - Обычная = 0
	 * - Цикличная = 1
	 * - Остановка на последнем фрейме = 2
	 * - Верхняя часть тела = 16
	 * - Разрешить пользователю управление = 32
	 * - Отменяемая = 120
	 * - Нечётное число: бесконечный цикл
	 * - Чётное число: заморозить на последнем фрейме
	 * - Кратное 4: заморозить на последнем фрейме, но разрешить управление
	 * - от 01 до 15: контроль всего тела
	 * - от 10 до 31: верхняя часть тела
	 * - от 32 до 47: всё тело > контролируемое
	 * - от 48 до 63: нижняя часть тела > контролируемое
	 * - от 001 до 255: обычная
	 * - от 256 до 511: искажённая
	 * 
	 * @param dict словарь анимаций
	 * @param name название анимации
	 * @param speed скорость воспроизведения
	 * @param flag флаг анимации
	 * 
	 * @todo проверить флаги
	 */
  playAnimation(dict: string, name: string, speed: number, flag: number): void;
	/**
	 * Останавливает проигрывание анимации.
	 */
	stopAnimation(): void;
	/**
	 * Помещает игрока в транспорт.
	 * @param vehicle объект транспорта
	 * @param seat место в транспорте
	 * 
	 * @remarks Вы не сможете поместить игрока в транспорт сразу же после его создания, используйте задержку (200 мс должно быть достаточно).
	 */
	putIntoVehicle(vehicle: VehicleMp, seat: RageEnums.VehicleSeat | number): void;
	/**
	 * Удаляет всё оружие у игрока
	 */
	removeAllWeapons(): void;
	/**
	 * Удаляет татуировку (украшение) из коллекции.
	 * @param decoration тип татуировки
	 * @param collection коллекция
	 */
	removeDecoration(decoration: number, collection: number): void;
	/**
	 * Извлекает игрока из транспорта.
	 */
	removeFromVehicle(): void;
	removeObject(object: any): void; // TODO
	/**
	 * Удаляет оружие у игрока.
	 * @param weaponHash название оружия
	 */
	removeWeapon(weaponHash: RageEnums.Hashes.Weapon | HashOrString): void;
	/**
	 * Устанавливает одежду для игрока.
	 * @param component компонент одежды
	 * @param drawable 
	 * @param texture 
	 * @param palette 
	 * 
	 * @remarks
	 * Список компонент одежды можно просмотреть [здесь](https://wiki.rage.mp/index.php?title=Clothes).
	 * Список названий одежды можно просмотреть [здесь](https://github.com/root-cause/v-clothingnames/).
	 */
  setClothes(component: RageEnums.ClothesComponent | number, drawable: number, texture: number, palette: number): void;
	/**
	 * Устанавливает настройки кастомизации игрока 
	 * @remarks
	 * Данный метод сбрасывает оружие игрока.
	 * Варианты цветов волос можно найти [здесь](https://wiki.gtanet.work/index.php?title=Hair_Colors).
	 * 
	 * @param gender пол
	 * @param shapeFirst наследственная форма лица от матери
	 * @param shapeSecond насладственная форма лица от отца
	 * @param shapeThird неизвестно (использовать значение = 0)
	 * @param skinFirst наследственная черта лица от матери
	 * @param skinSecond наследственная черта лица от отца
	 * @param skinThird неизвестно (использовать значение = 0)
	 * @param shapeMix параметр сходства формы лица с предком (0.0 - мать, 1.0 - отец)
	 * @param skinMix параметр сходства черт лица с предком (0.0 - мать, 1.0 - отец)
	 * @param thirdMix неизвестно (использовать значение = 0)
	 * @param eyeColor цвет глаз (от 0 до 31)
	 * @param hairColor цвет волос (от 0 до 63)
	 * @param hightlightColor дополнительный цвет волос (от 0 до 63)
	 * @param faceFeatures параметры черт лица
	 */
	setCustomization(gender: boolean, shapeFirst: number, shapeSecond: number, shapeThird: number, skinFirst: number,
    skinSecond: number, skinThird: number, shapeMix: number, skinMix: number, thirdMix: number, eyeColor: number,
    hairColor: number, hightlightColor: number, faceFeatures: number[]
	): void;
	/**
	 * Устанавливает татуировку (наклейку) игроку.
	 * @param collection название коллекции
	 * @param overlay название татуировки (наклейки)
	 */
	setDecoration(collection: number, overlay: number): void;
	/**
	 * Устанавливает параметр черты лица, например, длину носа или форму подбородка.
	 * @param index черта лица
	 * @param scale параметр черты лица (от -1.0 до 1.0)
	 */
	setFaceFeature(index: RageEnums.FaceFeature | number, scale: number): void;
	/**
	 * Устанавливает цвет волос.
	 * @remarks
	 * Доступные цвета волос можно просмотреть [здесь](https://wiki.gtanet.work/index.php?title=Hair_Colors).
	 * @param firstColor основной цвет
	 * @param secondColor дополнительный цвет
	 */
	setHairColor(firstColor: number, secondColor: number): void;
	/**
	 * Установить параметры внешности (наследственности).
	 * @param shapeFirst наследственная форма лица от матери
	 * @param shapeSecond насладственная форма лица от отца
	 * @param shapeThird неизвестно (использовать значение = 0)
	 * @param skinFirst наследственная черта лица от матери
	 * @param skinSecond наследственная черта лица от отца
	 * @param skinThird неизвестно (использовать значение = 0)
	 * @param shapeMix параметр сходства формы лица с предком (0.0 - мать, 1.0 - отец)
	 * @param skinMix параметр сходства черт лица с предком (0.0 - мать, 1.0 - отец)
	 * @param thirdMix неизвестно (использовать значение = 0)
	 */
  setHeadBlend(shapeFirst: number, shapeSecond: number, shapeThird: number, skinFirst: number, skinSecond: number,
    skinThird: number, shapeMix: number, skinMix: number, thirdMix: number): void;
	setHeadBlendPaletteColor(rgbColor: Array3d, type: 0 | 1 | 2 | 3): void;
	/**
	 * Устанавливает детали лица (недостатки) или макияж
	 * @param overlay деталь лица
	 * @param value  массив, содержащий тип детали, основной цвет, дополнительный цвет и прозрачность
	 */
	setHeadOverlay(overlay: RageEnums.HeadOverlay | number, value: Array4d): void;
	/**
	 * Устанавливает значение общей для игроков переменной.
	 * @param key название переменной
	 * @param value значение переменной
	 */
	setOwnVariable(key: string, value: any): void;
	/**
	 * Устанавливает значения общих для игроков переменных.
	 * @param values набор названий переменных и их значений
	 */
	setOwnVariables(values: KeyValueCollection): void;
	/**
	 * Добавляет аксессуар для игрока.
	 * @param prop тип аксессуара
	 * @param drawable имя объекта
	 * @param texture имя текстуры
	 */
  setProp(prop: RageEnums.PlayerProp | number, drawable: number, texture: number): void;
	/**
	 * Устанавливает количество боеприпасов для выбранного оружия.
	 * @param weapon название оружия
	 * @param ammo количество боеприпасов
	 */
	setWeaponAmmo(weapon: RageEnums.Hashes.Weapon | HashOrString, ammo: number): void;
	/**
	 * Спавнит игрока.
	 * @param position координаты спавна 
	 */
	spawn(position: Vector3Mp): void;
	/**
	 * Обновляет параметры наследственности
	 * @param shapeMix параметр сходства формы лица с предком (0.0 - мать, 1.0 - отец)
	 * @param skinMix параметр сходства черт лица с предком (0.0 - мать, 1.0 - отец)
	 * @param thirdMix неизвестно (использовать значение = 0)
	 */
	updateHeadBlend(shapeMix: number, skinMix: number, thirdMix: number): void;
	/**
	 * Запускает выполнение сценария для игрока.
	 * @remarks
	 * Список сценариев доступен [здесь](https://github.com/DurtyFree/gta-v-data-dumps/blob/master/scenariosCompact.json).
	 * @param scenario название сценария
	 */
  playScenario(scenario: string): void;
  callToStreamed(includeSelf: boolean, eventName: string, args?: any[])
}

/**
 * Представляет объект метки.
 */
interface TextLabelMp extends EntityMp {
  color: RGB;
  drawDistance: number;
  los: boolean;
  text: string;
}

/**
 * Представляет объект транспорта.
 */
interface VehicleMp extends EntityMp {
  bodyHealth: number;
  brake: boolean;
  controller: PlayerMp | undefined;
  customTires: boolean;
  engine: boolean;
  engineHealth: number;
  dashboardColor: number;
  dead: boolean;
  highbeams: boolean;
  horn: boolean;
  livery: number;
  locked: boolean;
  movable: boolean;
  neonEnabled: boolean;
  numberPlate: string;
  numberPlateType: number;
  pearlescentColor: number;
  rocketBoost: boolean;
  rotation: Vector3Mp;
  siren: boolean;
  steerAngle: number;
  taxiLights: boolean;
  trimColor: number;
  velocity: Vector3Mp;
  wheelColor: number;
  wheelType: number;
  windowTint: number;
  readonly extras: boolean[];
  readonly heading: number;
  readonly mods: number[];
  readonly quaternion: QuaternionMp,
  readonly streamedPlayers: PlayerMp[];
  readonly trailer: VehicleMp;
  readonly traileredBy: VehicleMp;

	/**
	 * Взрывает транспорт.
	 */
	explode(): void;
	/**
	 * Получает цвет транспорта.
	 * @remarks
	 * Список значений цветов можно просмотреть [здесь](https://wiki.rage.mp/index.php?title=Vehicle_Colors).
	 * @param id тип цвета (0 - основной, 1 - дополнительный)
	 * @return значение цвета в виде числа.
	 */
	getColor(id: number): number;
	/**
	 * Получает цвет транспорта в формате rgb.
	 * @param id тип цвета (0 - основной, 1 - дополнительный)
	 * @return массив цветов в формате rgb.
	 */
	getColorRGB(id: number): RGB;
	/**
	 * Устанавливает дополнительные элементы для транспорта.
	 * @remarks
	 * Примерами являются такие элементы, как спойлер Infernus / Elegy2, держатели для кофейных чашек внутри автомобилей или кабриолеты с жёсткой крышей, как Coquette.
	 * Не все виды транспорта имеют дополнительные элементы.
	 * @param index индекс элемента
	 * @param value активация отображения
	 */
	/**
	 * Проверяет, установлен дополнительный элемент у транспорта или нет.
	 * @param index индекс дополнительного элемента
	 * @return результат проверки.
	 */
	getExtra(index: number): boolean;
	/**
	 * Получает значение установленной модификации транспорта.
	 * @param modType тип модификации
	 * @return значение модификации.
	 */
	getMod(modType: number): number;
	/**
	 * Получает цвет неоновых огней в формате RGB
	 * @return массив цветов (красный, зелёный, синий)
	 */
  getNeonColor(): number[];
	getOccupant(seat: number): PlayerMp;
	/**
	 * Получает список тех, кто находится в транспорте.
	 * @return массив игроков.
	 */
	getOccupants(): PlayerMp[];
	getPaint(id: number): number; // id: 0 - primary, 1 - secondary
	/**
	 * Проверяет, находится машина в зоне видимости игрока или нет.
	 * @param player игрок.
	 * @return результат проверки (true - транспорт находится в зоне видимости).
	 */
	isStreamed(player: PlayerMp): boolean;
	/**
	 * Воспроизводит сценарий для транспорта.
	 * @param scenario название сценария
	 */
	playScenario(scenario: string): void;
	/**
	 * Ремонтирует транспорт.
	 */
	repair(): void;
	/**
	 * устанавливает цвет транспорта.
	 * @remarks
	 * Список значений цветов можно просмотреть [здесь](https://wiki.rage.mp/index.php?title=Vehicle_Colors).
	 * @param primary основной цвет
	 * @param secondary дополнительный цвет
	 */
	setColor(primary: number, secondary: number): void;
	/**
	 * Устанавливает цвет транспорта (формат rgb)
	 * @param red1 красный основной цвет (от 0 до 255)
	 * @param green1 зелёный основной цвет (от 0 до 255)
	 * @param blue1 синий основной цвет (от 0 до 255)
	 * @param red2 красный дополнительный цвет (от 0 до 255)
	 * @param green2 зелёный дополнительный цвет (от 0 до 255)
	 * @param blue2 синий дополнительный цвет (от 0 до 255)
	 */
  setColorRGB(red1: number, green1: number, blue1: number, red2: number, green2: number, blue2: number): void;
	
	/**
	 * Устанавливает дополнительные элементы для транспорта.
	 * @remarks
	 * Примерами являются такие элементы, как спойлер Infernus / Elegy2, держатели для кофейных чашек внутри автомобилей или кабриолеты с жёсткой крышей, как Coquette.
	 * Не все виды транспорта имеют дополнительные элементы.
	 * @param index индекс элемента
	 * @param value активация отображения
	 */
	setExtra(index: number, value: boolean): void;
	/**
	 * Устанавливает улучшение для транспорта.
	 * @remarks
	 * Типы улучшений можно просмотреть [здесь](https://wiki.rage.mp/index.php?title=Vehicle_Mods).
	 * @param modType тип улучшения
	 * @param modIndex вариант
	 */
	setMod(modType: number, modIndex: number): void;
	/**
	 * Устанавливает неоновые огни для транспорта.
	 * @param red красный цвет (от 0 до 255)
	 * @param green зелёный цвет (от 0 до 255)
	 * @param blue синий цвет (от 0 до 255)
	 */
	setNeonColor(red: number, green: number, blue: number): void;
	/**
	 * Устанавливает принт на транспорт.
	 * @param primaryType тип основного принта
	 * @param primaryColor основной цвет
	 * @param secondaryType тип дополнительного принта
	 * @param secondaryColor дополнительный цвет
	 */
  setPaint(primaryType: number, primaryColor: number, secondaryType: number, secondaryColor: number): void;
	/**
	 * Перемещает игрока в транспорт на указанное место
	 * @param seat место
	 * @param player игрок
	 */
	setOccupant(seat: number, player: PlayerMp): void;
	/**
	 * Спавнит траспорт.
	 * @param position координаты спавна
	 * @param heading угол поворота
	 */
  spawn(position: Vector3Mp, heading: number): void;
}

// -------------------------------------------------------------------------
// Simple MP types
// -------------------------------------------------------------------------

interface NetworkMp {
	/**
	 * Включает ручной пакетный режим для всех вызовов глобального API.
	 */
  startBatch(): void;
  endBatch(): void;
}

/**
 * Представляет игровой мир.
 */
interface WorldMp {
  weather: RageEnums.Weather | string;
  time: { 
    hour: number,
    minute: number,
    second: number
    /**
		 * Установить игровое время
		 * @param hour часы
		 * @param minute минуты
		 * @param second секунды
		 */
    set(hour: number, minute: number, second: number): void;
  };
  trafficLights: {
    locked: boolean,
    state: number;
  };

	/**
	 * Удаляет интерьер/локацию из игрового мира и синхронизирует с каждым клиентом.
	 * @remarks
	 * Список интерьеров и локаций можно просмотреть [здесь](https://wiki.rage.mp/index.php?title=Interiors_and_Locations).
	 * @param name название IPL
	 */
	removeIpl(name: string): void;
	/**
	 * Запрашивает интерьер/локацию и синхронизирует с каждым клиентом.
	 * @remarks
	 * Список интерьеров и локаций можно просмотреть [здесь](https://wiki.rage.mp/index.php?title=Interiors_and_Locations).
	 * @param name название IPL
	 */
	requestIpl(name: string): void;
	/**
	 * Запускает переход погоды к указанному состоянию и синхронизирует его со всеми клиентами.
	 * @remarks
	 * Использование варианта со временем перехода вызывает проблемы с графикой при переходе от смога до туманной погоды (и, вероятно, до какой-либо другой погоды), поэтому сейчас лучшим выбором будет сделать переход погоды на стороне клиента и синхронизировать его вручную.
	 * @param weather тип погоды
	 * @param duration время перехода
	 */
  setWeatherTransition(weather: RageEnums.Weather | string, duration?: number): void;
}

interface EventMp {
  destroy(): void;
}

interface ConfigMp {
  announce: boolean,
  bind: string,
  gamemode: string,
  encryption: boolean,
  maxplayers: number,
  name: string,
  'stream-distance': number,
  port: number,
  'disallow-multiple-connections-per-ip': boolean,
  'limit-time-of-connections-per-ip': number,
  url: string,
  language: string,
  'sync-rate': number,
  'resource-scan-thread-limit': number,
  'max-ping': number,
  'min-fps': number,
  'max-packet-loss': number,
  'allow-cef-debugging': boolean,
  'enable-nodejs': boolean,
  'csharp': boolean,
  'enable-http-security': boolean,
  'voice-chat': boolean,
  'allow-voice-chat-input': number,
  'voice-chat-sample-rate': number,
  'fastdl-host': string,
}

// -------------------------------------------------------------------------
// Pool MP types
// -------------------------------------------------------------------------

interface BlipMpPool extends EntityMpPool<BlipMp> {
  "new"(sprite: number, position: Vector3Mp, options?: {
    alpha?: number,
    color?: number,
    dimension?: number,
    drawDistance?: number,
    name?: string,
    rotation?: number,
    scale?: number,
    shortRange?: boolean
  }): BlipMp;
}

interface CheckpointMpPool extends EntityMpPool<CheckpointMp> {
  "new"(type: number, position: Vector3Mp, radius: number, options?: {
    color?: RGBA,
    dimension?: number,
    direction?: Vector3Mp,
    visible?	: boolean
  }): CheckpointMp;
}

/**
 * Представляет пул объектов коллизий.
 */
interface ColshapeMpPool extends EntityMpPool<ColshapeMp> {
	/**
	 * Создаёт область коллизии в форме круга в двухмерном пространстве.
	 * @param x центр круга по оси x
	 * @param y центр круга по оси y
	 * @param range радиус
	 * @param dimension измерение
	 * @return объект коллизии круга.
	 */
	newCircle(x: number, y: number, range: number, dimension?: number): ColshapeMp;
	/**
	 * Создаёт область коллизии в форме параллелепипеда в трёхмерном пространстве.
	 * @param x начальная точка на оси x
	 * @param y начальная точка на оси y
	 * @param z начальная точка на оси z
	 * @param width ширина
	 * @param depth глубина
	 * @param height высота
	 * @param dimension измерение
	 * @return объект коллизии параллелепипеда.
	 */
  newCuboid(x: number, y: number, z: number, width: number, depth: number, height: number, dimension?: number): ColshapeMp;
	/**
	 * Создаёт область коллизии в форме прямоугольника в двухмерном пространстве.
	 * @param x начальная точка на оси x
	 * @param y начальная точка на оси y
	 * @param width ширина
	 * @param height высота
	 * @param dimension измерение
	 * @return объект коллизии прямоугольника.
	 */
	newRectangle(x: number, y: number, width: number, height: number, dimension?: number): ColshapeMp;
	/**
	 * Создаёт область коллизии в форме сферы в трёхмерном пространстве.
	 * @param x центр сферы на оси x
	 * @param y центр сферы на оси y
	 * @param z центр сферы на оси z
	 * @param range радиус
	 * @param dimension измерение
	 * @return объект коллизии сферы.
	 */
	newSphere(x: number, y: number, z: number, range: number, dimension?: number): ColshapeMp;
	/**
	 * Создаёт область коллизии в форме полого цилиндра в трёхмерном пространстве.
	 * @param x начало области на оси x
	 * @param y начало области на оси y
	 * @param z начало области на оси z
	 * @param height высота
	 * @param range радиус
	 * @param dimension измерение
	 * @return объект коллизии полого цилиндра.
	 */
	newTube(x: number, y: number, z: number, height: number, range: number, dimension?: number): ColshapeMp;
}

interface DummyEntityMpPool {
  "new"(dummyEntityType: number, sharedVariables: KeyValueCollection): DummyEntityMp;

  forEachByType(dummyEntityType: number, fn: (entity: DummyEntityMp) => void): void;
}

interface EntityMpPool<TEntity> {
  readonly length: number;
  readonly size: number;

	apply(fn: (...args: any[]) => void, ...args: any[]): void;
	/**
	 * Возвращает элемент из пула по его индексу.
	 * @param index индекс.
	 * @return объект сущности.
	 */
	at(index: number): TEntity;
	/**
	 * Проверяет, существует сущность в пуле или нет.
	 * @param entity проверяемая сущность
	 * @return результат проверки (true - существует).
	 */
	exists(entity: TEntity | number): boolean;
	/**
	 * Вызывает выполнение переданной функции для каждого элемента пула.
	 * @param fn выполняемая функция
	 */
	forEach(fn: (entity: TEntity) => void): void;
	/**
	 * Вызывает выполнение переданной функции для каждого элемента пула, находящегося в радиусе указанной координаты.
	 * @param position координата
	 * @param range радиус
	 * @param fn выполняемая функция
	 */
  forEachInRange(position: Vector3Mp, range: number, fn: (entity: TEntity) => void): void;
	/**
	 * Вызывает выполнение переданной функции для каждого элемента пула, находящегося в радиусе указанной координаты в указанном измерении.
	 * @param position координата
	 * @param range радиус
	 * @param dimension измерение
	 * @param fn выполняемая функция
	 */
	forEachInRange(position: Vector3Mp, range: number, dimension: number, fn: (entity: TEntity) => void): void;
	/**
	 * Вызывает выполнение переданной функции для каждого элемента пула, находящегося в пределах указанного измерения.
	 * @param dimension измерение
	 * @param fn выполняемая функция
	 */
	forEachInDimension(dimension: number, fn: (entity: TEntity) => void): void;
	/**
	 * Получает сущность, находящуюся ближе всех к указанной точке.
	 * @param position точка в пространстве
	 * @return ближайшая сущность.
	 */
	getClosest(position: Vector3Mp): TEntity
	/**
	 * Получает сортированный список сущностей, находящихся ближе всех к указанной точке, начиная от ближайшего.
	 * @param position точка в пространстве
	 * @param limit максимальное количество сущностей в списке
	 * @return список ближайших сущностей
	 */
	getClosest(position: Vector3Mp, limit: number): TEntity[]
	/**
	 * Получает сущность, находящуюся ближе всех к указанной точке в указанном измерении.
	 * @param position точка в пространстве
	 * @param dimension измерение
	 * @return ближайшая сущность.
	 */
	getClosestInDimension(position: Vector3Mp, dimension: number): TEntity;
	/**
	 * Получает сортированный список сущностей, находящихся ближе всех к указанной точке в указанном измерении, начиная от ближайшего.
	 * @param position точка в пространстве
	 * @param dimension измерение
	 * @param limit максимальное количество сущностей в списке
	 * @return список ближайших сущностей
	 */
	getClosestInDimension(position: Vector3Mp, dimension: number, limit: number): TEntity[];
	/**
	 * Конвертирует пул в массив.
	 * @return массив сущностей.
	 */
  toArray(): TEntity[];
  toArrayFast(): TEntity[];
}

interface EventMpPool {
	/**
	 * Флаг задержки остановки сервера.
	 */
	delayShutdown: boolean
	/**
	 * Флаг задержки инициализации сервера.
	 */
  delayInitialization: boolean

	/**
	 * Добавит событие, которое будет вызвано при попадании игрока в контрольную точку.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
  add(eventName: RageEnums.EventKey.PLAYER_ENTER_CHECKPOINT, callback: (player: PlayerMp, checkpoint: CheckpointMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при покидании игроком контрольной точки.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_EXIT_CHECKPOINT, callback: (player: PlayerMp, checkpoint: CheckpointMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при попадании игроком в зону коллизии.
	 * @remarks
	 * По умолчанию измерение для области коллизии = 0, и игрок должен находиться в том же измерении для вызова события.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_ENTER_COLSHAPE, callback: (player: PlayerMp, colshape: ColshapeMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при покидании игроком зоны коллизии.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_EXIT_COLSHAPE, callback: (player: PlayerMp, colshape: ColshapeMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при создании новой сущности на сервере.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.ENTITY_CREATED, callback: (entity: EntityMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при уничтожении сущности на сервере.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.ENTITY_DESTROYED, callback: (entity: EntityMp) => void): void;
	/**
	 * Добавит событие, которое будет изменена модель сущности.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.ENTITY_MODEL_CHANGE, callback: (entity: EntityMp, oldModel: number) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при отправлении игроком сообщения в чат.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_CHAT, callback: (player: PlayerMp, text: string) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при введении игроком команды.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_COMMAND, callback: (player: PlayerMp, command: string) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при получении игроком урона.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_DAMAGE, callback: (player: PlayerMp, healthLoss: number, armorLoss: number) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при смерти игрока.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_DEATH, callback: (player: PlayerMp, reason: number, killer?: PlayerMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при присоединении игрока к серверу.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_JOIN, callback: (player: PlayerMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при покидании игроком сервера.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_QUIT, callback: (player: PlayerMp, exitType: string, reason: string) => void): void;
	/**
	 * Добавит событие, которое будет вызвано, когда игрок загрузит все пакеты ресурсов и будет готов играть на сервере.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_READY, callback: (player: PlayerMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при спавне игрока.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_SPAWN, callback: (player: PlayerMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при смене игроком оружия.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_WEAPON_CHANGE, callback: (player: PlayerMp, oldWeapon: number, newWeapon: number) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при остановке сервера.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.SERVER_SHUTDOWN, callback: () => void): void;
	/**
	 * Добавит событие, которое будет вызвано, когда игрок устанавливает соединение с сервером перед загрузкой ресурсов.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.INCOMING_CONNECTION, callback: (ip: string, serial: string, rgscName: string, rgscId: string, gameType: string) => void): void; // TODO: test actual gameType type (most likely  string)
	/**
	 * Добавит событие, которое будет вызвано при загрузке всех ресурсов в каталоге packages.
	 * @remarks
	 * Вы можете отложить запуск этого события с помощью флага mp.events.delayInitialization.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PACKAGES_LOADED, callback: () => void): void;
	/**
	 * Добавит событие, которое будет вызвано, когда игрок сядет в транспорт.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_ENTER_VEHICLE, callback: (player: PlayerMp, vehicle: VehicleMp, seat: number) => void): void;
	/**
	 * Добавит событие, которое будет вызвано, когда игрок покинет транспорт.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_EXIT_VEHICLE, callback: (player: PlayerMp, vehicle: VehicleMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано, когда игрок начнёт садиться в транспорт.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_START_ENTER_VEHICLE, callback: (player: PlayerMp, vehicle: VehicleMp, seat: number) => void): void;
  // todo: check vehicle param
	/**
	 * Добавит событие, которое будет вызвано, когда игрок начнёт выходить из транспорта.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.PLAYER_START_EXIT_VEHICLE, callback: (player: PlayerMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано при прикреплении прицепа к транспорту.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.TRAILER_ATTACHED, callback: (vehicle: VehicleMp, trailer: VehicleMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано, когда транспорт получит повреждения.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.VEHICLE_DAMAGE, callback: (vehicle: VehicleMp, bodyHealthLoss: number, engineHealthLoss: number) => void): void;
	/**
	 * Добавит событие, которое будет вызвано, когда транспорт будет уничтожен.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.VEHICLE_DEATH, callback: (vehicle: VehicleMp) => void): void;
	/**
	 * Добавит событие, которое будет вызвано, когда игрок активирует гудок у транспорта.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.VEHICLE_HORN_TOGGLE, callback: (vehicle: VehicleMp, toggle: boolean) => void): void;
	/**
	 * Добавит событие, которое будет вызвано, когда игрок включит сирены у транспорта.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
	add(eventName: RageEnums.EventKey.VEHICLE_SIREN_TOGGLE, callback: (vehicle: VehicleMp, toggle: boolean) => void): void;
	/**
	 * Добавит пользовательское событие на сервере.
	 * @param eventName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */
  add(eventName: RageEnums.EventKey | string, callback: (...args: any[]) => void): void;
	/**
	 * Добавит пользовательские события на сервере.
	 * @param events объект наборов названий событий и вызываемых функций
	 */
	add(events: ({ [name: string]: (...args: any[]) => void; })): void;
	/**
	 * Регистрирует событие удалённого вызова (RPC) с ожиданием обратного вызова.
	 * @param procName название события
	 * @param callback функция, вызываемая при срабатывании события
	 */	
	addProc(procName: string, callback: (...args: any[]) => void): void;
	/**
	 * Регистрирует набор событий удалённого вызова (RPC) с ожиданием обратного вызова.
	 * @param procs набор событий и функций обратного вызова
	 */	
	addProc(procs: ({ [name: string]: (...args: any[]) => void; })): void;
	/**
	 * Регистрирует команду на сервере.
	 * @param commandName название команды
	 * @param callback функция обратного вызова
	 */
	addCommand(commandName: string, callback: (player: PlayerMp, fullText: string, ...args: string[]) => void): void;
	/**
	 * Регистрирует набор команд на сервере.
	 * @param commands набор команд и функций обратного вызова.
	 */
	addCommand(commands: { [commandName: string]: (player: PlayerMp, fullText: string, ...args: string[]) => void; }): void;
	/**
	 * Вызывает зарегистрированное событие на сервере.
	 * @param eventName название события
	 * @param args аргументы, передаваемые в функцию обратного вызова
	 */
	call(eventName: string, ...args: any[]): void;
	/**
	 * Вызывает событие, зарегистрированное на C#.
	 * @param eventName название события
	 * @param args аргументы, ередаваемые в функцию обратного вызова
	 */
	callLocal(eventName: string, args?: any[]): void;
	/**
	 * Получает список всех обработчиков указанного события.
	 * @param eventName название события
	 * @return список обработчиков.
	 */
	getAllOf(eventName: string): EventMp[];
	/**
	 * Удаляет указанное события из дерева событий.
	 * @param eventName название события
	 * @param handler обработчик события (по умолчанию пустое значение, удаляет все обработчики указанного события)
	 */
	remove(eventName: string, handler?: (...args: any[]) => void): void;
	/**
	 * Удаляет набор событий.
	 * @param eventNames массив названий событий
	 */
	remove(eventNames: string[]): void;
	/**
	 * Сбрасывает весь менеджер событий.
	 */
  reset(): void;
}

interface MarkerMpPool extends EntityMpPool<MarkerMp> {
  "new"(type: number, position: Vector3Mp, scale: number, options?: {
    color?: RGBA,
    dimension?: number,
    direction?: Vector3Mp,
    rotation?: Vector3Mp,
    visible?: boolean
  }): MarkerMp;
}

interface PedMpPool extends EntityMpPool<PedMp> {
  "new"(modelHash: number, position: Vector3Mp, options?: {
    dynamic?: boolean,
    frozen?: boolean,
    invincible?: boolean,
    lockController?: boolean
  }): PedMp;
}

interface ObjectMpPool extends EntityMpPool<ObjectMp> {
  "new"(model: HashOrString, position: Vector3Mp, options?: {
    alpha?: number,
    dimension?: number,
    rotation?: Vector3Mp
  }): ObjectMp;
}

interface PickupMpPool extends EntityMpPool<PickupMp> {
  //"new"(...args: any[]): PickupMp; // Not working anymore
}

interface PlayerMpPool extends EntityMpPool<PlayerMp> {
	/**
	 * Отправляет сообщение в чат всем пользователям.
	 * @param text текст сообщения
	 */
	broadcast(text: string): void;
	/**
	 * Отправляет сообщение в чат всем пользователям, находящимся в указанном радиусе.
	 * @param position точка в пространстве
	 * @param range радиус
	 * @param text текст сообщения
	 */
  broadcastInRange(position: Vector3Mp, range: number, text: string): void;
	/**
	 * Отправляет сообщение в чат всем пользователям, находящимся в указанном радиусе и в указанном измерении.
	 * @param position точка в пространстве
	 * @param range радиус
	 * @param dimension измерение
	 * @param text текст сообщения
	 */
	broadcastInRange(position: Vector3Mp, range: number, dimension: number, text: string): void;
	/**
	 * Вызывает событие на клиентах всех игроков.
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	call(eventName: string, args?: any[]): void;
	/**
	 * Вызывает событие на клиентах указанных игроков.
	 * @param players массив игроков
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	call(players: PlayerMp[], eventName: string, args?: any[]): void;
	/**
	 * Вызывает событие на клиентах всех игроков, находящихся в указанном измерении.
	 * @param dimension измерение
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	callInDimension(dimension: number, eventName: string, args?: any[]): void;
	/**
	 * Вызывает событие на клиентах всех игроков, находящихся в указанном радиусе.
	 * @param position точка в пространстве
	 * @param range радиус
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	callInRange(position: Vector3Mp, range: number, eventName: string, args?: any[]): void;
	/**
	 * Вызывает событие на клиентах всех игроков, находящихся в указанном радиусе и в указанном измерении.
	 * @param position точка в пространстве
	 * @param range радиус
	 * @param dimension измерение
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	callInRange(position: Vector3Mp, range: number, dimension: number, eventName: string, args?: any[]): void;
	/**
	 * Вызывает события на клиентах всех игроков по протоколу UDP.
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	callUnreliable(eventName: string, args?: any[]): void;
	/**
	 * Вызывает события на клиентах указанных игроков по протоколу UDP.
	 * @param players список игроков
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	callUnreliable(players: PlayerMp[], eventName: string, args?: any[]): void;
	/**
	 * Вызывает события на клиентах всех игроков, находящихся в указанном измерении, по протоколу UDP.
	 * @param dimension измерение
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	callInDimensionUnreliable(dimension: number, eventName: string, args?: any[]): void;
	/**
	 * Вызывает события на клиентах всех игроков, находящихся в указанном радиусе, по протоколу UDP.
	 * @param position точка в пространстве
	 * @param range радиус
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	callInRangeUnreliable(position: Vector3Mp, range: number, eventName: string, args?: any[]): void;
	/**
	 * Вызывает события на клиентах всех игроков, находящихся в указанном радиусе и в указанном измерении, по протоколу UDP.
	 * @param position точка в пространстве
	 * @param range радиус
	 * @param dimension измерение
	 * @param eventName название события
	 * @param args аргументы, передаваемые на клиент
	 */
	callInRangeUnreliable(position: Vector3Mp, range: number, dimension: number, eventName: string, args?: any[]): void;
}

interface TextLabelMpPool extends EntityMpPool<TextLabelMp> {
  "new"(text: string, position: Vector3Mp, options?: {
    color?: RGBA,
    dimension?: number,
    drawDistance?: number,
    font?: number,
    los?: boolean
  }): TextLabelMp;
}

interface VehicleMpPool extends EntityMpPool<VehicleMp> {
  "new"(model: RageEnums.Hashes.Vehicle | HashOrString, position: Vector3Mp, options?: {
    alpha?: number,
    color?: [ Array2d, Array2d ] | [ RGB, RGB ],
    dimension?: number,
    engine?: boolean,
    heading?: number;
    locked?: boolean,
    numberPlate?: string
  }): VehicleMp;
}

// -------------------------------------------------------------------------
// Additional MP types
// -------------------------------------------------------------------------

type Vector3Mp = {
  new(x: number, y: number, z: number): Vector3Mp;

  x: number;
  y: number;
  z: number;
	/**
	 * Выполняет сложение вектора и скаляра.
	 * @param value скалярное значение слагаемого
	 * @return сумма вектора и скаляра `value`.
	 */
	add(value: number): Vector3Mp;
	/**
	 * Выполняет сложение двух векторов.
	 * @param vector3 векторное значение слагаемого
	 * @return сумма векторов
	 */
	add(vector3: Vector3Mp): Vector3Mp;
	/**
	 * Находит угол между двумя векторами.
	 * @param vector3 вектор
	 * @return угол (в радианах)
	 */
	angleTo(vector3: Vector3Mp): number;
	/**
	 * Копирует вектор.
	 * @return копия вектора.
	 */
	clone(): Vector3Mp;
	/**
	 * Выполняет векторное произведение двух векторов.
	 * @param vector3 вектор-множитель
	 * @return результатирующий вектор.
	 */
	cross(vector3: Vector3Mp): Vector3Mp;
	/**
	 * Выполняет деление вектора на скаляр.
	 * @param value скалярное значение делителя
	 * @return частное.
	 */
	divide(value: number): Vector3Mp;
	/**
	 * Выполняет деление вектора на вектор.
	 * @param vector3 векторное значение делителя
	 * @return частное.
	 */
	divide(vector3: Vector3Mp): Vector3Mp;
	/**
	 * Выполняет скалярное произведение двух векторов.
	 * @param vector3 векторное значение множителя
	 * @return произведение.
	 */
	dot(vector3: Vector3Mp): number;
	/**
	 * Проверяет, равны друг другу два вектора или нет.
	 * @param vector3 вектор
	 * @return результат (true - векторы эквивалентны).
	 */
	equals(vector3: Vector3Mp): boolean;
	/**
	 * Возвращает модуль вектора.
	 * @return модуль вектора.
	 */
	length(): number;
	/**
	 * Возвращает максимальное значение части вектора.
	 * @return максимальное значение.
	 */
	max(): number;
	/**
	 * Возвращает минимальное значение части вектора.
	 * @return минимальное значение.
	 */
	min(): number;
	/**
	 * Выполняет произведение вектора на скаляр.
	 * @param value скалярное значение множителя
	 * @return результат умножения.
	 */
	multiply(value: number): Vector3Mp;
	/**
	 * Выполняет произведение вектора на вектор (перемножаются значения вектора между собой).
	 * @param vector3 векторное значение множителя
	 * @return результат умножения.
	 */
	multiply(vector3: Vector3Mp): Vector3Mp;
	/**
	 * Получает обратный вектор.
	 * @remarks
	 * Данное действие идентично умножению вектора на -1.
	 * @return обратный вектор.
	 */
	negative(): Vector3Mp;
	/**
	 * Выполняет вычитание скаляра из вектора.
	 * @param value скалярное значение вычитаемого
	 * @return разность.
	 */
	subtract(value: number): Vector3Mp;
	/**
	 * Выполняет вычитание вектора из вектора.
	 * @param vector3 векторное значение вычитаемого
	 * @return разность.
	 */
  subtract(vector3: Vector3Mp): Vector3Mp;
	toAngles(): Array2d;
	/**
	 * Конвертирует вектор в массив.
	 * @return массив значений вектора.
	 */
	toArray(): Array3d;
	/**
	 * Нормализует вектор, создавая коллинеарный вектор с единичной длиной.
	 * @return нормализованный вектор.
	 */
  unit(): Vector3Mp;
}

type PlayerWeaponCollectionMp = {
  current: number;

  reset(): void;
}

type QuaternionMp = {
  x: number;
  y: number;
  z: number;
  w: number;
}

// -------------------------------------------------------------------------
// Default typings extends
// -------------------------------------------------------------------------

interface Function {
  cancel: boolean;
  handler: EventMp;
}

// -------------------------------------------------------------------------
// Vars
// -------------------------------------------------------------------------

declare const mp: Mp;
