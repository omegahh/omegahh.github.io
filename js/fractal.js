// let div = document.getElementById("fractal"),
	// c = init("fractal", "canvas"),
	// w = (canvas.width = div.clientWidth),
	// h = (canvas.height = div.clientHeight);
let [div, canvas, c, w, h] = init("fractal", "canvas")
//initiation
let t = 0,
	dang = Math.random()*2*Math.PI,
	num = (Math.floor(Math.random()*5)+1)+(Math.floor(Math.random()*5)+1),
	strt = Math.random()*2*Math.PI;

function fractal(x,y,r,ang,da,it){
	this.x1 = x+r*Math.cos(ang);
	this.y1 = y+r*Math.sin(ang);
	this.midx = (x+this.x1)/2;
	this.midy = (y+this.y1)/2;
	c.beginPath();
	c.arc(this.midx,this.midy,r/2,0,2*Math.PI);
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
	//animation
	for(let i = 0; i < num; i++){
		fractal(
			w/2,
			h/2,
			200+50*Math.sin(2*dang)-50,
			0*Math.PI/180+2*i*Math.PI/num,
			t*Math.PI/180+strt,
			0);
	}
	if(mouse.x && mouse.y){
		t=360/(w/mouse.x);
		dang=2*Math.PI/(h/mouse.y);
	}else{
		t+=0.1;
		dang+=0.01;
	}

}

let mouse = {};
let last_mouse = {};

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
function init(divid, elemid) {
	let div = document.getElementById(divid),
		canvas = document.getElementById(elemid),
		c = canvas.getContext("2d"),
		w = (canvas.width = div.clientWidth),
		h = (canvas.height = div.clientHeight);
	c.fillStyle = "rgba(30,30,30,1)";
	c.fillRect(0, 0, w, h);
	return [div, canvas, c, w, h];
}

window.requestAnimFrame = (function() {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback);
		}
	);
});

function loop() {
	window.requestAnimFrame(loop);
	c.fillStyle = "rgba(30,30,30,1)";
	c.fillRect(0, 0, w, h);
	draw();
}

window.addEventListener("resize", function() {
	(w = canvas.width = div.clientWidth),
	(h = canvas.height = div.clientHeight);
	loop();
});

loop();
setInterval(loop, 1000 / 60);
