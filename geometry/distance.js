/**
 * Расстояние точки от отрезка
 */
function distanceOfLinePart(P, [A, B]){
	let AB = B.sub(A);
	let AP = P.sub(A);
	let x = AP.dot(AB)/(AB.abs()**2);
	if(x>0 && x<1){
		let cos = Vector.cosDiff(AB, AP);
		//console.log(cos);
		let sin = Math.sqrt(1 - cos**2);
		let d = AP.abs()*sin;
		
		return d;
	}
	else{
		//точка не проецируется на отрезок, находим расстояние до ближайшего конца
		return Math.min(AB.abs(), P.sub(B).abs());
	}
}

module.exports = {
	distanceOfLinePart
}