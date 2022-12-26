
const {Vector3, Vector2, Vector} = require('@grunmouse/math-vector');
const {SquareMatrix2} = require('@grunmouse/math-matrix');

const {
	isoradial,
	deltoid
} = require('../geometry/deltoid.js');

const {
	besierForPoints
} = require('../geometry/besier.js');

const {
	Line,
	Circle,
	Part,
	Arc,
	intersect
} = require('../geometry/primitives.js');


const defsepdir = new Vector2(0, 1);

class AbstractSegment{
	constructor(attributes){
		const {
			x0, dir0, dir1, length
		} = attributes;
		
		Object.assign(this, attributes);

		this.x1 = x0 + length;
		this.P0 = new Vector2(x0,0);
		this.P1 = new Vector2(x1,0);
		this.line0 = new Line(P0, P0.add(dir0));
		this.line1 = new Line(P1, P1.add(dir1));
	}
	
	/**
	 *
	 * @property line0 : Line
	 * @property line1 : Line
	 * Границы области координат сегмента, заданные во внутренней системе координат
	 */
	 
	/**
	 * Усекает отрезок пределами сегмента
	 * @param AB : Part - исходный отрезок
	 *
	 * @return Object
	 * @property part : Array[2]<Vector2> - обрезанный отрезок
	 * @property empty : Boolean - признак отсутствия отрезка
	 * @property ext0 : Boolean - признак выхода за начало
	 * @property ext1 : Boolean - признак выхода за конец
	 */
	function cutLineBySeg(AB){
		let [A, B] = AB;
		let {P0, P1, dir0, dir1, line0, line1} = this;
		
		/*
		 Обозначим
		 P = (AB) \intersect line0
		 Q = (AB) \intersect line1
		 */
		
		const AaftP = A.sub(P0).cross(dir0) < 0; // A за P
		const AaftQ = A.sub(P1).cross(dir1) > 0; // A за Q
		const BaftP = B.sub(P0).cross(dir0) < 0; // B за P
		const BaftQ = B.sub(P1).cross(dir1) > 0; // B за Q
		
		//console.log(AaftP, AaftQ, BaftP, BaftQ);
		
		/*
		AaftP AaftQ BaftP BaftQ
		0     0     0     0 //AB
		0     0     0     1 //AQ
		0     0     1     0 //AP
		0     1     0     0 //QB
		1     0     0     0 //PB
		0     0     1     1 //A(P|Q)
		1     1     0     0 //(P|Q)B
		0     1     1     0 //QP
		1     0     0     1 //PQ
		0     1     0     1 //emp
		1     1     0     1 //emp
		0     1     1     1 //emp
		1     0     1     0 //emp
		1     0     1     1 //emp
		1     1     1     0 //emp
		1     1     1     1 //emp
		*/	
		
		const result = {
			ext0: AaftP || BaftP,
			ext1: AaftQ || BaftQ
		};
		
		if(!AaftP && !AaftQ && !BaftP && !BaftQ){
			//Усечение не требуется
			result.part = [A, B];
		}
		else if(AaftP && BaftP || AaftQ && BaftQ){
			//Весь отрезок за line0 или line1
			result.empty = true
		}
		else{
			const P = AB.intersect(line0);
			const Q = AB.intersect(line1);
			
			const notP = !P || P.sub(P1).cross(dir1) > 0; //P вне области
			const notQ = !Q || Q.sub(P0).cross(dir0) < 0; //Q вне области
			const QeqP = P && Q && P.eq(Q);
			
			if(AaftP && AaftQ){
				// !BaftP && BaftQ
				if(notP){
					result.part = [Q, B];
				}
				else if(notQ || QeqP){
					result.part = [P, B];
				}
				else{
					throw new Error('Неизвестное состояние');
				}
			}
			else if(BaftP && BaftQ){
				// !AaftP && AaftQ
				if(notP){
					result.part = [A, Q];
				}
				else if(notQ || QeqP){
					result.part = [A, P];
				}
				else{
					throw new Error('Неизвестное состояние');
				}
			}
			else if(AaftP && BaftQ){
				result.part = [P, Q];
			}
			else if(AaftQ && BaftP){
				result.part = [Q, P];
			}
			else if(AaftP){
				result.part = [P, B];
			}
			else if(AaftQ){
				result.part = [Q, B];
			}
			else if(BaftP){
				result.part = [A, P];
			}
			else if(BaftQ){
				result.part = [A, Q];
			}
		}
		
		if(!result.empty && result.part[0].eq(result.part[1])){
			delete result.part;
			result.empty = true;
		}
		
		return result;
	}

}

class LineSegment extends AbstractSegment{
	constructor(attributes){
		const {
			start,
			fin,
			startline,
			endline,
			x0
		} = attributes;

		const OX = fin.sub(start);
		const rot = SquareMatrix2.rotate(OX.phi());
		const rotin = rot.transpose();

		let dir0 = startline ? rotin.mul(startline) : defsepdir;
		if(dir0.y < 0){
			dir0 = dir0.neg();
		}
		let dir1 = endline ? rotin.mul(endline) : defsepdir;
		if(dir1.y < 0){
			dir1 = dir1.neg();
		}

		let length = fin.sub(start).abs();
		
		super({
			...attributes,
			dir0,
			dir1,
			length,
			rot
		});
	}
	
	/**
	 * Преобразует внутрениие координаты в абсолютные
	 */
	convert(P){
		const {rot, P0, start} = this;
		return rot.mul(P.sub(P0)).add(start);
	}	
	
	convertPart(AB){
		let [A, B] = AB;
		let [start, fin] = AB.map((P)=>(this.convert(P)));		
		return {type:'line', start, fin};
	}
}

class ArcSegment extends AbstractSegment{
	constructor(attributes){
		const {
			start,
			fin,
			radius,
			center,
			x0
		} = attributes;
		let length = Vector.angle(start.sub(center), fin.sub(center)) * radius;	
		
		const R0 = start.sub(center);
		const R1 = fin.sub(center);
		const phi0 = R0.phi();
		
		const sign = Math.sign(R0.cross(R1)); // знак направления поворота
		
		super({
			...attributes,
			dir0: defsepdir,
			dir1: defsepdir,
			length,
			sign,
			phi0
		});
	}

	convert(P){
		const {P0, radius, sign, phi0, center} = this;
		let {x, y} = P.sub(P0);
		let abs = radius - sign*y
		let phi = sign*x/radius + phi0;
		
		return Vector2.fromPolar({abs,phi}).add(center);
	}
	
	convertPolar(P){
		const {P0, radius, sign, phi0, center} = this;
		let {x, y} = P.sub(P0);
		let abs = radius - sign*y
		let phi = sign*x/radius + phi0;
		return {abs,phi};
	}
	
	convertPart(AB){
		let [A, B] = AB;
		let [start, fin] = AB.map((P)=>(this.convert(P)));		
		if(A.x == B.x){
			//line
			return {type:'line', start, fin};
		}
		else if(A.y == B.y){
			let radius = start.sub(this.center).abs();
			let apex = deltoid(start, seg.center, fin);
			return {type:'arc', start, fin, radius, center:this.center, sign:this.sign, apex};
		}
		else{
			let P2 = B.sub(A).mul(1/3).add(A);
			let P3 = B.sub(A).mul(2/3).add(A);
			let curvePoints = [A, P2, P3, B].map((P)=>(this.convert(P)));
			let points = besierForPoints(...curvePoints);
			return {type:'curve', start, fin, points};
		}
	}	


}

module.exports = {
	LineSegment,
	ArcSegment
};