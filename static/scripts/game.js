var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.arc(20, 160, 10, 0, Math.PI*2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.rect(470, 170, 10, 150);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();