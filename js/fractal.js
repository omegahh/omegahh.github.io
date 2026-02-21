// Fractal animation initialization
// Only initialize if the canvas container exists
let div = document.getElementById("fractal");
if (!div) {
}

// Initialize canvas variables
let canvas, c, w, h;
let mouse = {};
let last_mouse = {};

// Animation state
let t = 0,
	dang = Math.random()*2*Math.PI,
	num = (Math.floor(Math.random()*5)+1)+(Math.floor(Math.random()*5)+1),
	strt = Math.random()*2*Math.PI;

function fractal(x,y,r,ang,da,it){
	if (!c) return; // Safety check

	let x1 = x+r*Math.cos(ang);
	let y1 = y+r*Math.sin(ang);
	let midx = (x+x1)/2;
	let midy = (y+y1)/2;

	c.beginPath();
	c.arc(midx, midy, r/2, 0, 2*Math.PI);
	c.fillStyle="rgba(255,255,255,0.25)";
	c.fill();
	c.strokeStyle="rgba(255,255,255,1)";
	c.lineWidth="0.5";
	c.stroke();

	if(it < 7){
		fractal(
			x+r*Math.cos(ang-dang),
			y+r*Math.sin(ang-dang),
			0.5*r,
			ang+da,
			da,
			it+1);
		fractal(
			x+r*Math.cos(ang+dang),
			y+r*Math.sin(ang+dang),
			0.5*r,
			ang-da,
			da,
			it+1);
	}
}

function draw() {
	if (!c || !w || !h) return; // Safety check

	// Draw fractal patterns
	for(let i = 0; i < num; i++){
		fractal(
			w/2,
			h/2,
			200+50*Math.sin(2*dang)-50,
			0*Math.PI/180+2*i*Math.PI/num,
			t*Math.PI/180+strt,
			0);
	}

	// Update animation parameters based on mouse position or auto-animate
	if(mouse.x && mouse.y){
		t = 360/(w/mouse.x);
		dang = 2*Math.PI/(h/mouse.y);
	} else {
		t += 0.1;
		dang += 0.01;
	}
}

function init(divid, elemid) {
	let div = document.getElementById(divid);
	let canvas = document.getElementById(elemid);

	if (!div || !canvas) {
		return [null, null, null, 0, 0];
	}

	let context = canvas.getContext("2d");

	// Get the actual display size from the container
	// Subtract padding (20px on each side = 40px total)
	let width = div.clientWidth - 40;
	let height = div.clientHeight - 40;

	// Set canvas resolution to match display size
	canvas.width = width;
	canvas.height = height;

	// Initial background
	context.fillStyle = "rgba(30,30,30,1)";
	context.fillRect(0, 0, width, height);

	return [div, canvas, context, width, height];
}

// Polyfill for requestAnimationFrame
window.requestAnimFrame = (function() {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	);
})();

function loop() {
	if (!c || !canvas || !animationRunning) return; // Safety check

	// Clear canvas with background
	c.fillStyle = "rgba(30,30,30,1)";
	c.fillRect(0, 0, w, h);

	// Draw fractal
	draw();

	// Request next frame only if animation is still running
	if (animationRunning) {
		animationFrameId = window.requestAnimFrame(loop);
	}
}

// Animation control
let animationRunning = false;
let animationFrameId = null;

// Start the fractal animation
window.startFractalAnimation = function() {
	if (animationRunning) return; // Already running

	if (!div || window.innerWidth < 992) {
		return;
	}

	// Initialize if not already done
	if (!canvas || !c) {
		[div, canvas, c, w, h] = init("fractal", "canvas");

		if (canvas && c) {
			// Setup mouse tracking
			canvas.addEventListener(
				"mousemove",
				function(e) {
					last_mouse.x = mouse.x;
					last_mouse.y = mouse.y;

					mouse.x = e.pageX - this.offsetLeft;
					mouse.y = e.pageY - this.offsetTop;
				},
				false
			);

			// Handle window resize
			window.addEventListener("resize", function() {
				if (div && canvas && window.innerWidth >= 992) {
					// Recalculate dimensions accounting for padding
					w = canvas.width = div.clientWidth - 40;
					h = canvas.height = div.clientHeight - 40;
				}
			});
		}
	}

	if (canvas && c) {
		animationRunning = true;
		loop();
	}
};

// Stop the fractal animation
window.stopFractalAnimation = function() {
	if (!animationRunning) return;

	animationRunning = false;
	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId);
		animationFrameId = null;
	}
};
