/**
MandelBrot Sketch
formula = f(z) = z^2 + c
=> z(n + 1) = z(n) ^ 2 + c
**/

let width = 500;
let height = 500;

let MANDEL_MAX_ITER = 100;
let MANDEL_SCALE = 0.009;
let MANDEL_LIMIT = 1 << 16;
let MANDEL_X = -3;
let MANDEL_Y = -2.5;

let MANDEL_LIMIT_SLIDER;
let MANDEL_SCALE_SLIDER;
let MANDEL_X_SLIDER;
let MANDEL_Y_SLIDER;

let prev_mandel_x = -1000;
let prev_mandel_y = -1000;
let prev_mandel_scale = -1;

let MANDEL_BROT_MAP_ARRAY = [];

function setupSlider(min, max, initial_value, step, name) {
	let slider = createSlider(min, max, initial_value, step);
	slider.id(name);
	
	let paragraph = createP(name);
	paragraph.id("p")

	let div = createDiv();
	div.child(paragraph);
	div.child(slider);

	return slider;
}

function setup() {
	createCanvas(width, height);
	setPixelColor(MANDEL_SCALE);

	MANDEL_SCALE_SLIDER = setupSlider(0, 0.01, MANDEL_SCALE, 0.0001, "MANDEL_SCALE_SLIDER");
	MANDEL_X_SLIDER = setupSlider(-10, 10, MANDEL_X, 0.1, "MANDEL_X_SLIDER");
	MANDEL_Y_SLIDER = setupSlider(-10, 10, MANDEL_Y, 0.1, "MANDEL_Y_SLIDER");

}

function draw() {
	let mandel_scale = MANDEL_SCALE_SLIDER.value();
	let mandel_x = MANDEL_X_SLIDER.value();
	let mandel_y = MANDEL_Y_SLIDER.value();

	if(start(mandel_x, mandel_y, mandel_scale,
		     prev_mandel_x, prev_mandel_y, prev_mandel_scale)) {
		console.log("start");
		setPixelColor(mandel_scale, mandel_x, mandel_y);
	}
	prev_mandel_x = mandel_x;
	prev_mandel_y = mandel_y;
	prev_mandel_scale = mandel_scale;
}

function start(mandel_x, mandel_y, mandel_scale, 
	 		   prev_mandel_x, prev_mandel_y, prev_mandel_scale) {
	return (mandel_x !== prev_mandel_x) || 
	       (mandel_y !== prev_mandel_y) ||
	       (mandel_scale !== prev_mandel_scale)
}

function setPixelColor(mandel_scale, mandel_x, mandel_y) {
	loadPixels();
	for (let x = 0; x < width; x += 1) {
		for (let y = 0; y < height; y += 1) {
			mandelBrotColour(x, y, mandel_scale, mandel_x, mandel_y);
	  	}
	}
	updatePixels();
}

function mandelBrotColour(px, py, mandel_scale, mandel_x, mandel_y) {
	let iteration = 0;
	x0 = mandel_x + px * mandel_scale;
	y0 = mandel_y + py * mandel_scale;
	x = 0;
	y = 0;
	let magnitude = (x + y) * (x + y);
	while(magnitude <= MANDEL_LIMIT && iteration < MANDEL_MAX_ITER) {
		xTemp = (x + y) * (x - y) + x0;
		yTemp = ((x + x) * y) + y0;
		y = yTemp;
		x = xTemp;
		iteration += 1;
		magnitude = (x + y) * (x + y);
	}

	let nu = (log(log(magnitude) / log(2))) / log(2);
	let grad = iteration + 1 - nu;
	set(px, py, color(sin(0.016 * grad) * 255, 
					  sin(0.013 * grad) * 255 + 15, 
					  sin(0.01 * grad) * 255 + 55));
}


function mandelBrotMap() {
	let array_of_maps = [];
	for (let px = 0; px < width; px += 1) {
		for (let py = 0; py < height; py += 1) {
			let iteration = 0;
			x0 = MANDEL_X + px * MANDEL_SCALE;
			y0 = MANDEL_Y + py * MANDEL_SCALE;
			x = 0;
			y = 0;
			let magnitude = (x + y) * (x + y);
			while(magnitude <= MANDEL_LIMIT && iteration < MANDEL_MAX_ITER) {
				xTemp = (x + y) * (x - y) + x0;
				yTemp = ((x + x) * y) + y0;
				y = yTemp;
				x = xTemp;
				iteration += 1;
				magnitude = (x + y) * (x + y);
			}
			array_of_maps.push({iteration: iteration, magnitude: magnitude});
		}
	}
	return array_of_maps;
}