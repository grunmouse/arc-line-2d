const {symbols:{SUB, ADD, MUL, DIV}} = require('@grunmouse/multioperator-ariphmetic');

/**
 * Находит массив разностей точек
 */
function delta(arr){
	let len = arr.length-1;
	let res = [];
	for(let i=0;i<len; ++i){
		res[i] = arr[i+1][SUB](arr[i]);
	}
	return res;
}


/**
 * Возвращает массив накопленных сумм значений входного массива
 */
function accum(start, arr){
	let res = [start];
	for(let item of arr){
		start = start[ADD](item);
		res.push(start);
	}
	return res;
}

/**
 * Находит массив разностей точек по кольцу
 */
function odelta(arr){
	let len = arr.length-1;
	let res = [];
	for(let i=0;i<len; ++i){
		res[i] = arr[i+1][SUB](arr[i]);
	}
	res[len] = arr[0][SUB](arr[len]);
	return res;
}

module.exports = {
	delta,
	odelta,
	accum
}