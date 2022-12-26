
/**
 * @type UPath - универсальное представление пути
 * @property els : Array<IElement> - массив элементов пути
 * @property stroke : String - цвет границы
 * @property fill : String - цвет заливки
 * @property close : Boolean - признак замкнутости контура
 *
 * @interface IElement
 * @property type : String = "line" | "arc" | "curve" | "move"
 * @property start : Vector2
 * @property fin : Vector2
 * @property points? : Array[4]<Vector2> - точки для типа "curve"
 * @property apex? : Vector2 - вершина для типа "arc"
 * @property radius? : Number - радиус для типа "arc"
 * @property sign? : {-1; 1} - знак кривизны для типа "arc"
 */
