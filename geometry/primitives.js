const {Vector2} = require('@grunmouse/math-vector');
const MOP = require('@grunmouse/multioperator');

class Line{
	constructor(A, B){
		this.A = A;
		this.B = B;

		const X = B.sub(A).ort();
		const Y = X.rotOrto(1);
		
		this.basis = {X, Y};
	}
	
	*[Symbol.iterator](){
		yield A;
		yield B;
	}
	
	pointPosition(P){
		const {X, Y}  = this.basis;
		
		const x = this.dot(X);
		const y = this.dot(Y);
		
		return new Vector2(x, y);
	}
	
	distance(P){
		const pos = this.pointPisition(P);
		
		return Math.abs(pos.y);
	}
	
}

class Part extends Line{
	
	constructor(A, B){
		super(A, B);
		this.len = this.B.sub(this.A).abs();
	}
	
	line(){
		return new Line(this.A, this.B);
	}
	
	
	distance(P){
		const pos = this.pointPisition(P);
		let dist;
		
		if(pos.x < 0){
			dist = P.sub(this.A).abs();
		}
		else if(pos.x > this.len){
			dist = P.sub(this.B).abs();
		}
		else{
			dist = Math.abs(pos.y);
		}
		
		return dist;
	}

	get isProjected{
		return (P)=>{
			const pos = this.pointPisition(P);
			return pos.x >=0 && pos.x <= this.len;
		}
	}
	
	includes(P){
		const pos = this.pointPisition(P);
		
		return Math.abs(pos.y) <= Numper.EPSILON && pos.x >=0 && pos.x <= this.len;
	}
}

class Circle{
	constructor(C, R){
		this.C = C;
		this.R = R;
	}
}

class Arc{
	constructor(C, R, a0, a1, outer){
		this.C = C;
		this.R = R;
		this.a0 = a0;
		this.a1 = a1;
		
		this.R0 = Vector2.fromPolar({phi:a0, abs:R});
		this.R1 = Vector2.fromPolar({phi:a1, abs:R});
		this.sign = Math.sign(R0.cross(R1)); // знак пары векторов
		this.outer = outer;
	}
	
	//Попадает ли центральная проекция точки на дугу
	get isProjected{
		return (P)=>{
			let inSector = P.sub(this.C).isInSector(this.R0, this.R1);
			
			if(this.outer){
				inSector = !inSector; //обход по большей дуге
			}
			
			return inSector;
		};
	}
}

/**
 * Конечное множество точек
 */
class Points extends Array{
	constructor(...points){
		let len = points.length;
		if(len===1){
			super(1);
			this[0] = points[0];
		}
		else if(len === 0){
			super();
		}
		else{
			super(...points);
		}
	}
	
	isEmpty(){
		return this.length === 0;
	}
	
	any(){
		return this[0];
	}
	
	add(point){
		this.push(point);
	}
}

const intersect = new MOP('intersect');
const commutativus = (a, b)=>(b[intersect.key](a));

intersect.useName(Line);
intersect.useName(Part);
intersect.useName(Circle);
intersect.useName(Arc);

intersect.def(Line, Line, function([A, B], [C, D]){
	const result = new Points();
	const V = B.sub(A), W = D.sub(C); //Направляющие вектора прямых
	/*
	R_00 = A; R_01 = B; r_0 = V;
	R_10 = C; R_11 = D; r_1 = W;
	
	R = \frac{r_0 (R_11 \times R_10) - r_1 (R_01  \times R_00)}{r_1 \times r_0}
	
	\times - псевдоскалярное произведение
	Опущен - знак умножения на число
	
	R = \frac{V (D \times C) - W (B  \times A)}{W \times V}
	*/
	
	let N = W.cross(V); //Знаменатель выражения
	//Проверка нуля
	let ctrl = Math.abs(N / W.dot(V));
	if(ctrl <= Number.EPSILON){
		return result;
	}
	const R = V.mul(D.cross(C)).sub(W.mul(B.cross(A))).div(N);
	
	result.add(R);
	
	return result;
});

intersect.def(Line, Part, function(a, b){
	let points = intersect.getImplement(Line, Line)(a, b);
	points = points.filter((P)=>(b.isProjected(P)));
	return points;
});

intersect.def(Part, Line, commutativus);

intersect.def(Part, Part, (a, b)=>{
	let points = intersect.getImplement(Line, Line)(a, b);
	points = points.filter((P)=>(a.isProjected(P) && b.isProjected(P)));
	return points; 
});

intersect.def(Line, Circle, (l, c)=>{
	const C = l.pointPosition(c.C);
	const {X, Y] = l.basis;
	
	/*
		C - координаты центра окружности в системе, связанной с направляющим вектором прямой
		Прямая в этих координатах совпадает с осью x.
		
		(x - x0)^2 + (y - y0)^2 = R^2,
		x0 = C.x,
		y0 = C.y,
		y = 0;
		(x - x0)^2 + y0^2 = R^2;
		x^2 - 2 * x0 * x + x0^2 + y0^2 - R^2 = 0; - квадратное уравнение
		a = 1, b = -2*x0, c = x0^2 + y0^2 - R^2;
		
			D/4 = (b/2)^2 - a*c;
			x_1,2 = (-(b/2) ± sqrt(D/4))/a.
			
		D/4 = x0^2 - (x0^2 + y0^2 - R^2);
		D/4 = y0^2 - R^2;
		x_1,2 = x0 ± sqrt(D/4).
	*/
	
	const D_4 = C.y**2 - c.R**2;
	
	let points = new Points();
	
	if(D_4 < 0){
		return points;
	}
	
	let sqd = Math.sqrt(D_4);
	
	let x = [C.x - sqd, C.x + sqd];
	
	x.forEach((x)=>{
		points.add(X.mul(x).add(l.A));
	});
	
	return points;
	
});

intersect.def(Circle, Line, commutativus);

intersect.def(Part, Circle, (p, c)=>{
	let points = intersect.getImplement(Line, Circle)(p, c);
	
	points = points.filter(p.isProjected);
	
	return points;
});

intersect.def(Circle, Part, commutativus);

intersect.def(Line, Arc, (l, a)=>{
	let points = intersect.getImplement(Line, Circle)(l, a);
	
	points = points.filter(a.isProjected);
	
	return points;
	
});
intersect.def(Arc, Line, commutativus);

intersect.def(Part, Arc, (p, a)=>{
	let points = intersect.getImplement(Line, Circle)(p, a);
	
	points = points.filter((P)=>(a.isProjected(P) && p.isProjected(P)));
	
	return points;
	
});
intersect.def(Arc, Part, commutativus);


intersect.def(Circle, Circle, (a, b)=>{
	const axis = new Part(a.C, b.C);
	const d = axis.len;
	
	/*
		x = (R0^2 - R1^2 +d^2)/(2*d);
	*/
	const x = ((a.R**2 - b.R**2)/d + d)/2
	
	const h2 = a.R**2 - x**2;
	
	let points = new Points();
	if(h2 < 0){
		return points;
	}
	
	let y = Math.sqrt(h2);
	
	y = [-y, y];
	
	const {X, Y} = axis.basis;
	y.forEach((y)=>{
		points.add(X.mul(x).add(Y.mul(y)).add(a.C));
	});
	
	return points;
	
});

intersect.def(Arc, Circle, (a, c)=>{
	let points = intersect.getImplement(Circle, Circle)(a, c);
	
	points = points.filter(a.isProjected);
	
	return points;
});

intersect.def(Circle, Arc, commutativus);

intersect.def(Arc, Arc, (a, b)=>{
	let points = intersect.getImplement(Circle, Circle)(a, b);
	
	points = points.filter((P)=>(a.isProjected(P) && b.isProjected(P)));
	
	return points;
});

module.exports = {
	Line,
	Circle,
	Part,
	Arc,
	intersect
};