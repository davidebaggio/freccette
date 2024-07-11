let inputs_div = document.getElementById("inputs");
let restart_div = document.getElementById("restart");
restart_div.style.display = "none";
let restart_button = document.getElementById("restart-b");

let main_div = document.getElementById("main-div");
main_div.style.display = "none";

let name1 = document.getElementById("name1");
let name2 = document.getElementById("name2");
let tot_points = document.getElementById("tot-points");
let start_button = document.getElementById("info-b");

let game_name1 = document.getElementById("game-name1");
let point1 = document.getElementById("p1");
let pe11 = document.getElementById("pe11");
let pe12 = document.getElementById("pe12");
let pe13 = document.getElementById("pe13");
let b1 = document.getElementById("b1");
let sd1 = document.getElementById("sd1-text");

let game_name2 = document.getElementById("game-name2");
let point2 = document.getElementById("p2");
let pe21 = document.getElementById("pe21");
let pe22 = document.getElementById("pe22");
let pe23 = document.getElementById("pe23");
let b2 = document.getElementById("b2");
let sd2 = document.getElementById("sd2-text");

let canvas = document.getElementById("stats");
let ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const padding = 10;

let in_game = false;

let match_points1 = [];
let sum_points1 = [];
let match_points2 = [];
let sum_points2 = [];

var start_sound = new Audio("https://www.soundjay.com/misc/small-bell-ring-01a.mp3");
var end_sound = new Audio("https://www.soundjay.com/misc/pill-bottle-2.mp3");
var point_saved = new Audio("https://www.soundjay.com/misc/whip-whoosh-03.mp3");

restart_button.addEventListener("click", function () {
	inputs_div.style.display = "block";
	restart_div.style.display = "none";
	main_div.style.display = "none";

	game_name1.innerHTML = null;
	game_name2.innerHTML = null;
	point1.innerHTML = null;
	point2.innerHTML = null;
	pe11.value = null;
	pe12.value = null;
	pe13.value = null;
	pe21.value = null;
	pe22.value = null;
	pe23.value = null;

	in_game = false;
	match_points1 = [];
	sum_points1 = [];
	match_points2 = [];
	sum_points2 = [];

	end_sound.play();
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	sd1.innerHTML = null;
	sd2.innerHTML = null;
});

start_button.addEventListener("click", function () {
	let n1 = name1.value;
	let n2 = name2.value;
	let p = parseInt(tot_points.value);

	if (isNaN(p)) {
		alert("Please enter a valid number for total points");
		return;
	}

	game_name1.innerHTML = n1;
	game_name2.innerHTML = n2;
	point1.innerHTML = p;
	point2.innerHTML = p;
	console.log(n1, n2, p);
	inputs_div.style.display = "none";
	restart_div.style.display = "block";
	main_div.style.display = "flex";
	in_game = true;
	start_sound.play();

	drawLineChart();
});

b1.addEventListener("click", function () {
	if (!in_game) return;

	let a = parseInt(pe11.value)
	let b = parseInt(pe12.value)
	let c = parseInt(pe13.value);

	if (isNaN(a) || isNaN(b) || isNaN(c) || a < 0 || a > 60 || b < 0 || b > 60 || c < 0 || c > 60) {
		//alert("Please enter valid numbers");
		return;
	}

	match_points1.push(a);
	match_points1.push(b);
	match_points1.push(c);

	let sum = a + b + c;
	sum_points1.push(sum);

	drawLineChart();
	console.log(match_points1);
	pe11.value = null;
	pe12.value = null;
	pe13.value = null;
	point_saved.play();

	let actual_points = parseInt(point1.innerHTML);
	actual_points = Math.abs(actual_points - a);
	if (actual_points == 0) {
		alert(name1.value + " wins!");
		in_game = false;
	} else {
		actual_points = Math.abs(actual_points - b);
		if (actual_points == 0) {
			alert(name1.value + " wins!");
			in_game = false;
		} else {
			actual_points = Math.abs(actual_points - c);
			if (actual_points == 0) {
				alert(name1.value + " wins!");
				in_game = false;
			}
		}
	}
	point1.innerHTML = actual_points;

	updateStats();
});

b2.addEventListener("click", function () {
	if (!in_game) return;

	let a = parseInt(pe21.value)
	let b = parseInt(pe22.value)
	let c = parseInt(pe23.value);

	if (isNaN(a) || isNaN(b) || isNaN(c) || a < 0 || a > 60 || b < 0 || b > 60 || c < 0 || c > 60) {
		//alert("Please enter valid numbers");
		return;
	}

	match_points2.push(a);
	match_points2.push(b);
	match_points2.push(c);

	let sum = a + b + c;
	sum_points2.push(sum);

	drawLineChart();
	console.log(match_points2);
	pe21.value = null;
	pe22.value = null;
	pe23.value = null;
	point_saved.play();

	let actual_points = parseInt(point2.innerHTML);
	actual_points = Math.abs(actual_points - a);
	if (actual_points == 0) {
		alert(name2.value + " wins!");
		in_game = false;
	} else {
		actual_points = Math.abs(actual_points - b);
		if (actual_points == 0) {
			alert(name2.value + " wins!");
			in_game = false;
		} else {
			actual_points = Math.abs(actual_points - c);
			if (actual_points == 0) {
				alert(name2.value + " wins!");
				in_game = false;
			}
		}
	}
	point2.innerHTML = actual_points;

	updateStats();
});

window.addEventListener("keypress", (event) => {
	if (event.key === 'Enter' || event.code === 'Enter') {
		b1.click();
		b2.click();
	}
});

function drawDots(points, color, maxCount, minValue, xScale, yScale) {
	ctx.beginPath();
	ctx.moveTo(padding, canvasHeight - padding - (points[0] - minValue) * yScale);
	for (let i = 1; i < maxCount; i++) {
		ctx.lineTo(padding + i * xScale, canvasHeight - padding - (points[i] - minValue) * yScale);
	}
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	ctx.stroke();

	// Disegna i punti dati
	for (let i = 0; i < maxCount; i++) {
		const x = padding + i * xScale;
		const y = canvasHeight - padding - (points[i] - minValue) * yScale;
		ctx.beginPath();
		ctx.arc(x, y, 4, 0, Math.PI * 2, true);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}

// Funzione per disegnare il grafico a linee
function drawLineChart() {

	const maxCount = Math.max(sum_points1.length, sum_points2.length);
	//console.log(maxCount);
	const maxValue = Math.max(...sum_points1, ...sum_points2);
	const minValue = 0;
	const yScale = (canvasHeight - padding * 2) / (maxValue - minValue);
	const xScale = (canvasWidth - padding * 2) / (maxCount + 1);
	//console.log(xScale, yScale);

	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// Disegna gli assi
	ctx.beginPath();
	ctx.moveTo(padding, padding);
	ctx.lineTo(padding, canvasHeight - padding);
	ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 2;
	ctx.stroke();

	drawDots(sum_points1, 'blue', maxCount, minValue, xScale, yScale);

	drawDots(sum_points2, 'red', maxCount, minValue, xScale, yScale);
}

function getMean(array) {
	const n = array.length;
	if (n === 0) return 0;
	const mean = array.reduce((a, b) => a + b) / n;
	return mean;
}

function getStd(array) {
	const n = array.length;
	if (n === 0) return 0;
	const mean = getMean(array);
	return (mean, Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n));
}

function updateStats() {
	let mean1 = getMean(match_points1);
	let std1 = getStd(match_points1);
	//console.log(mean1, std1);
	sd1.innerHTML = "Media dei lanci = " + ((Math.round(mean1 * 100) / 100).toFixed(2)) + "\n" + "Dev. std. = " + ((Math.round(std1 * 100) / 100).toFixed(2));

	let mean2 = getMean(match_points2);
	let std2 = getStd(match_points2);
	//console.log(mean2, std2);
	sd2.innerHTML = "Media dei lanci = " + ((Math.round(mean2 * 100) / 100).toFixed(2)) + "\n" + "Dev. std. = " + ((Math.round(std2 * 100) / 100).toFixed(2));
}