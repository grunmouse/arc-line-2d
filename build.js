
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
 * @property points? : Array[4]<Vector2> - точки для типа "arc"
 * @property points? : Array[4]<Vector2>
 */


/**
 *
 * @interface IDrawing : Object
 * @property body : Array<Figure>
 *
 * @interface IFigure : Object
 * @property type 
 * @property stroke? : String - цвет границы
 * @property fill? : String - цвет заливки
 * @property superline? : Array<IFigure>
 * @property close : Boolean - признак замкнутости контура
 * @property repeat-x : 
 * 
 * @type Rounded
 * @implements IFigure
 * @property type = "rounded"
 * @property points : Array<IRoundedPoint>
 *
 * @interface IRoundedPoint
 * @imlplements Vector2
 * @property radius : Number
 */


/**
 * Функция, которая по JSON-описанию строит универсальное представление
 */
function buildBody(body){
	let items = body.map(buildPath).flat();
	return items;
}

function repeat

function buildPath(fig){
	if(fig.type === 'rounded'){
	}
	if(fig.superline){
	}
}

function build(f