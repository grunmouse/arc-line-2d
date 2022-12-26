
/**
 * Вычисляет опорные точки кривой Безье, проходящей через переданные четыре точки
 */
function besierForPoints(A, B, C, D){
	/*
		P1 = A
		P2 = (- 5A + 18B - 9C + 2D) / 6
		P3 = ( 2A - 9B + 18C - 5D) / 6
		P4 = D
	*/
	
	const P2 = A.mul(-5).add(B.mul(18)).add(C.mul(-9)).add(D.mul(2)).div(6);
	const P3 = A.mul(2).add(B.mul(-9)).add(C.mul(18)).add(D.mul(-5)).div(6);
	
	return [A, P2, P3, D];
}

module.exports = {
	besierForPoints
};