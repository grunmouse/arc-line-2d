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

function intersectCircle(C1, R1, C2, R2){
}

module.exports = {
	intersectLine,
	intersectLinePart,
	intersectPartAndLine
}