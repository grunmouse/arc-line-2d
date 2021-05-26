function moveto(v){
	return `${v.x} ${v.y} moveto`;
}

function lineto(v){
	return `${v.x} ${v.y} lineto`;
}


function renderElement(el){
	let {type, fin} = el.fin;
	if(type === 'line'){
		return lineto(fin);
	}
	else if(type === 'curve'){
		let [P0, P1, P2, P3] = el.points;
		return `${P1.x} ${P1.y} ${P2.x} ${P2.y} ${fin.x} ${fin.y} curveto`;
	}
	else if(type === 'arc'){
		let r = el.radius;
		let apex = el.apex;
		return `${apex.x} ${apex.y} ${fin.x} ${fin.y} arct`;
	}
	else if(type === 'move'){
		return moveto(fin);
	}
}

function psColor(color){
	if(color[0]==='#'){
		let R = color.slice(1,3);
		let G = color.slice(3,5);
		let B = color.slice(5,7);
		
		let code = [R, G, B].map((hex)=>(parseInt(hex, 16)/255));
		code.push('setrgbcolor');
		
		return code.join(' ');
	}
	else{
		throw new Error('Unknown ps color ' + color);
	}
}

/**
 * Отрисовывает путь из универсального представления
 */
function renderUPath(els, close, stroke, fill){
	let code = [
		moveto(els[0].start),
		'newpath'
	].concat(els.map(renderElement));
	if(close){
		code.push('closepath');
	}
	if(fill && fill !== 'none'){
		code.push(
			"gsave",
			psColor(fill),
			'fill',
			"grestore"
		);
	}
	if(stroke && stroke !== 'none'){
		code.push(
			"gsave",
			psColor(stroke),
			'stroke',
			"grestore"
		);
	}
		
	
	return code.join('\n');
}

module.exports = {
	path:renderUPath
};