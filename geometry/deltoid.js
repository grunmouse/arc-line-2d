/**
 * Находит четвёртую точку прямоугольного дельтоида, у которого углы B и D прямые
 */
function deltoid(B, A, D){
	let AD = D.sub(A);
	let ort = B.sub(A).add(AD).ort();
	let AC = ort.mul(AD.abs()/Vector.cosDiff(AD, ort));
	
	return A.add(AC);
}

/**
 * отсекает на угле BAD равнобедренный угол B'AD' со сторонами a
 */
function isosceles(B, A, D, a){
	let B1 = B.sub(A).ort().mul(a).add(A);
	let D1 = D.sub(A).ort().mul(a).add(A);
	return [B1, A, D1];
}

/**
 * отсекает на угле BAD равнобедренный угол B'AD', описанный около дуги радиусом r
 */
function isoradial(B, A, D, r){
	let cos = Vector.cosDiff(B.sub(A), D.sub(A));
	let tan = Math.tan(Math.acos(cos)/2);
	let a = r / tan;
	return isosceles(B, A, D, a);
}

module.exports = {
	deltoid,
	isosceles,
	isoradial
};