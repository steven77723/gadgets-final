
var socket = io.connect();
var allVals = [0, 0, 0];

var threshold = 300;

socket.on('sensorA', function (data) {
  // data.sensorVal is in the form X: ###
  document.getElementById("piezoAvgA").innerHTML = data.num;
  allVals[0] = data.num;
  // checkAllVals();
});

socket.on('sensorB', function (data) {
  document.getElementById("piezoAvgB").innerHTML = data.num;
  allVals[1] = data.num;
});

socket.on('sensorC', function (data) {
  document.getElementById("piezoAvgC").innerHTML = data.num;
  allVals[2] = data.num;
});


var width = 10;
var xvals = [];
var yvals = [];
var bvals = [];

function setup() 
{
  createCanvas(840, 480);
  // noSmooth();
  xvals = new Array(width);
  yvals = new Array(width);
  bvals = new Array(width);
}

var arrayindex = 0;

function draw()
{
  background(102);
  
  for(var i = 1; i < width; i++) { 
    xvals[i-1] = xvals[i]; 
    yvals[i-1] = yvals[i];
    bvals[i-1] = bvals[i];
  } 
  // Add the new values to the end of the array 
  xvals[width-1] = allVals[0]; 
  yvals[width-1] = allVals[1];
  bvals[width-1] = allVals[2];


  fill(255);
  noStroke();
  rect(0, height/3, width, height/3+1);

  for(var i=1; i<width; i++) {
    stroke(255);
    point(i, xvals[i]/3);
    stroke(0);
    point(i, height/3+yvals[i]/3);
    stroke(255);
    point(i, 2*height/3+bvals[i]/3);
  }
}
