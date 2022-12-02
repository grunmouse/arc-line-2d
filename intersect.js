const {Vector2} = require('@grunmouse/math-vector');

/**
 *
 * Проверка, лежит ли R на отрезке AB, если известно, что R лежит на прямой (AB)
 */
function isInPart(R, [A, B]){
	let AR = R.sub(A), AB = B.sub(A);
	let proj = AR.dot(AB)/AB.abs();
	
	return proj>=0 && proj<=AB.abs();
}

/**
 * Находит точку пересечения прямых AB и CD
 */
function intersectLine([A, B], [C, D]){
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
	if(ctrl < Number.EPSILON){
		return undefined;
	}
	const R = V.mul(D.cross(C)).sub(W.mul(B.cross(A))).div(N);
	
	return R;
}

/**
 * Находит точку пересечения отрезков AB и CD
 */
function intersectLinePart(AB, CD){
	const R = intersectLine(AB, CD);
	if(R){
		if(isInPart(R, AB) && isInPart(R, CD)){
			return R;
		}
		//console.log(AB, CD, R);
	}
}

/**
 * Находит точку пересечения отрезка AB и прямойCD
 */
function intersectPartAndLine(AB, CD){
	const R = intersectLine(AB, CD);
	if(R){
		if(isInPart(R, AB)){
			return R;
		}
		//console.log(AB, CD, R);
	}
}


function intersectCircleCircle(c1, r1, c2, r2) {
    var result;
	
	const Vector = c1.constructor;
    
    // Determine minimum and maximum radii where circles can intersect
    var r_max = r1 + r2;
    var r_min = Math.abs(r1 - r2);
    
    // Determine actual distance between circle circles
    var c_dist = c2.sub(c1).abs();

	var points = [];
	
    if ( c_dist > r_max ) {
        //result = new Intersection("Outside");
    } else if ( c_dist < r_min ) {
        //result = new Intersection("Inside");
    } else {
        //result = new Intersection("Intersection");

        var a = (r1*r1 - r2*r2 + c_dist*c_dist) / ( 2*c_dist );
        var h = Math.sqrt(r1*r1 - a*a);
        var p = c1.lerp(c2, a/c_dist);
        var b = h / c_dist;

        points.push(
            new Vector(
                p.x - b * (c2.y - c1.y),
                p.y + b * (c2.x - c1.x)
            )
        );
        points.push(
            new Vector(
                p.x + b * (c2.y - c1.y),
                p.y - b * (c2.x - c1.x)
            )
        );
    }

    return points;
};

function intersectCircleLinePart(c, r, a1, a2) {
    var result;
    var a  = (a2.x - a1.x) * (a2.x - a1.x) +
             (a2.y - a1.y) * (a2.y - a1.y);
    var b  = 2 * ( (a2.x - a1.x) * (a1.x - c.x) +
                   (a2.y - a1.y) * (a1.y - c.y)   );
    var cc = c.x*c.x + c.y*c.y + a1.x*a1.x + a1.y*a1.y -
             2 * (c.x * a1.x + c.y * a1.y) - r*r;
    var deter = b*b - 4*a*cc;

	var points = [];
	
    if ( deter < 0 ) {
        //result = new Intersection("Outside");
    } else if ( deter == 0 ) {
        //result = new Intersection("Tangent");
        // NOTE: should calculate this point
        var u1 = ( -b ) / ( 2*a );

		if ( 0 <= u1 && u1 <= 1)
			points.push( lerp(a1, a2, u1) );

    } else {
        var e  = Math.sqrt(deter);
        var u1 = ( -b + e ) / ( 2*a );
        var u2 = ( -b - e ) / ( 2*a );

        if ( (u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1) ) {
            if ( (u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1) ) {
                //result = new Intersection("Outside");
            } else {
                //result = new Intersection("Inside");
            }
        } else {
            //result = new Intersection("Intersection");

            if ( 0 <= u1 && u1 <= 1)
                points.push( lerp(a1, a2, u1) );

            if ( 0 <= u2 && u2 <= 1)
                points.push( lerp(a1, a2, u2) );
        }
    }
    
    return points;
};

function lepr(me, that, t){
	return new Vector2(
        me.x + (that.x - me.x) * t,
        me.y + (that.y - me.y) * t
	);
}

Point2D.prototype.lerp = function(that, t) {
    return new Point2D(
        this.x + (that.x - this.x) * t,
        this.y + (that.y - this.y) * t
    );
};


module.exports = {
	intersectLine,
	intersectLinePart,
	intersectPartAndLine
}