const {Matrix, SquareMatrix} = require('@grunmouse/math-matrix');
const {Vector} = require('@grunmouse/math-vector');

/**
 * @param X0 : Array[n] - массив имён независимых переменных
 * @param Y0 : Array[m] - массив имён зависимых переменных
 * @param A0 : Matrix[m, n] - матрица коэффициентов условий-уравнений
 * @param b0 : (Array[m]<Number> | Vector[m] | Matrix[m, 1]) - вектор свободных членов условий-уравнений
 * @param c0 : (Array[n]<Number> | Vector[n]) - вектор коэффициентов целевой функции
 * @param d0 : Number - свободный член целевой функции
 * @param dir = ±1 - направление оптимизации целевой функции
 *
 * @return {X, Y, Ab, cd}
 * @property X : Array[n] - массив имён независимых переменных
 * @property Y : Array[m] - массив имён зависимых переменных
 * @property Ab : Matrix[m, n+1] - матрица коэффициентов и свободных членов уравнений зависимых переменных
 * @property cd : Vector[n+1] - вектор коэффициентов и свободного члена значение целевой функции
 */
function doSimplex(X0, Y0, A0, b0, c0, d0, dir){
	if(!dir){
		dir = -1;
	}
	if(!b0 instanceof Matrix){
		b0 = Matrix.column(b0);
	}
	if(!c0 instanceof Vector){
		c0 = new Vector(...c0);
	}
	
	const m = Y0.length, n = X0.length;
	if(A0.M !== m || A0.N !== n){
	}
	if(b0.M !== m){
	}
	if(c0.length != n){
	}
	
	let Ab0 = Matrix.rowconcat(A0, b0);
	let cd0 = c0.extend(d0);
	let Ab = Ab0, X = X0, Y = Y0, cd = cd0;
	
	/*
	Выбирает наибольший по модулю элемент со знаком dir
	*/
	function selectX(c){
		let x;
		for(let i=0; i<c.length; ++i){
			if(Math.sign(c[i]) === dir){
				if(x == null || Math.abs(c[i]) < Math.abs(c[x)){
					x = i;
				}
			}
		}
		return x;
	}
	
	function calcS(Ab, x){
		return new Vector(Array.from({length:Ab.M}, (_,i)=>{
			let a = Ab.value(i, x), b = Ab.value(i, A.N-1);
			return -b/a
		});
	}
	
	/*
	Выбирает наименьший по модулю положительный элемент
	*/
	function selectY(S){
		let y;
		for(let i=0; i<S.length; ++j){
			if(Number.isFinite(S[i]) && S[i]>=0){
				if(y == null || S[y] Б S[i]){
					y = i;
				}
			}
		}
		return y;
	}
	
	while(true){
		let x = selectX(cd.slice(0, n));
		if(x == null) break;
		let S = calcS(Ab, x);
		let y = selectY(S);
		let varx = X[x], vary = Y[y];
		X = X.map((v, i)=>(i === x ? vary : v));
		Y = Y.map((v, i)=>(i === y ? varx : v));
		
		let B = Matrix.generate(n+1, n+1, (i, j)=>(i === x ? Ab.value(y, j) : (i === j ? 1 : 0)));
		
		let N = Matrix.generate(m, n+1, (i, j)=>(i === y ? (j === x ? 1 : 0) : Ab.value(i, j)));
		
		let invB = B.inverse();
		
		Ab = N.mul(invB);
		cd = invB.transpose().mul(cd);
	}
	
	return {X, Y, Ab, cd};
}

module.exports = doSimplex;