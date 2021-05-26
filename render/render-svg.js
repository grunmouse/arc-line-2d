function moveto(v){
	return `M ${v.x} ${v.y}`;
}

function lineto(v){
	return `L ${v.x} ${v.y}`;
}

function renderElement(el){
	let {type, fin} = el.fin;
	if(type === 'line'){
		return lineto(fin);
	}
	else if(type === 'curve'){
		let [P0, P1, P2, P3] = el.points;
		return `C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${fin.x} ${fin.y}`;
	}
	else if(type === 'arc'){
		let r = el.radius;
		let sweep = el.sign < 0 ? 0 : 1;
		return `A ${r} ${r} 0 0 ${sweep} ${fin.x} ${fin.y}`;
	}
	else if(type === 'move'){
		return moveto(fin);
	}
}

function svgElement(el){
	return moveto(el.start) + ' ' + renderElement(el);
}

function svgElements(els, close){
	let code = moveto(els[0].start) + ' ' + els.map(renderElement).join(' ');
	if(close){
		code += ' Z';
	}
	return code;
}

/**
 * Отрисовывает тег из универсального представления
 */
function svgUPath(els, close, stroke, fill){
	const d = svgElements(els, close);
	
	return `<path d="${d}" fill="${fill}" stroke="${stroke}" />`;
}

module.exports = {
	path:svgUPath
};