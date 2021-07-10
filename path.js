const {
	deltoid,
	isosceles,
	isoradial
} = require('./deltoid.js');

const {Vector2} = require('@grumouse/math-vector');

function Arc(param){
	let {start, fin, center, radius, apex, sign } = param;

	
	this.start = start;
	this.fin = fin;
	this.center = center;
	this.apex = apex;
	this.radius = radius;
	this.sign = sign;
}