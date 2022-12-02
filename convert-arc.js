
const {
	KNOWN_ENUM,
	VarNode,
	CalcNode,
	Edge,
	
	getGraph,
	getUsed,
	getAllGraph,
	joinGraphs,
	toDOT,
	fireEdges,
	resolveEdges,

	Setable,
	createVariables
} = require('@grunmouse/math-calc-scheme');

function convertArc(params){
	//Точки дельтоида
	const A = new VarNode('A');
	const S = new VarNode('S');
	const C = new VarNode('C');
	const F = new VarNode('F');
	//Углы концов дуги
	const aF = new VarNode('aF');
	const aS = new VarNode('aS');
	
	//Радиус
	const R = new VarNode('R');
	//Радиус-векторы концов
	const RS = new VarNode('RS');
	const RF = new VarNode('RF');

	//Знак угла дуги
	const sign = new VarNode('sign'); 

	const Deltoid = new CalcNode('deltoid', {A,S,C,F});
	
	const endF = new CalcNode('endF', {F, C, RF});
	const endS = new CalcNode('endS', {F, C, RS});
	
	const polarF = new CalcNode('polarF', (set)=>(set.has('RF') || set.has('R') && set.has('aF')), {RF, R, aF});
	const polarS = new CalcNode('polarS', (set)=>(set.has('RS') || set.has('R') && set.has('aS')), {RS, R, aS});
	
	
	const paramMap = {
		apex:A,
		start:S,
		center:C,
		fin:F,
		startAngle:aS,
		finAngle:aF,
		radius:R
	};
	for(let key in params){
		let v = paramMap[key];
		if(v){
			v.asSource();
		}
	}
}