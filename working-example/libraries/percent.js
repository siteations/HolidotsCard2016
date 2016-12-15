// automate area tests for default circles
// area comparison sq and circle -> percentage

var width;
var w2; // for double density
var heigth;
var wCenter;
var img;
var icons;
var grid;//placeholder for user grid selection
var dens;

function preload() { // this will actually need to be the feeder from camera...
  //take_snapshot();
  //img = loadImage("img/test.jpg");
  //icons as array of objects, 0-100, with each as []{ wreath:'img/linkhere.svg', ornament:'img/linkhere.svg', etc.}
  //perhaps automate that preloaded object in a different area and simply load all here;
}

function setup(){
	dens=1;
	width =32;
  	height=32*102;
	w2=width*dens;
	wCenter=(displayWidth-width)/2;


	var cnt=createCanvas(width, height); // the canvas
  		cnt.position(wCenter, 100);
  		cnt.id('pixelCanvas');

  	//pixelDensity(dens);
  	noLoop();

}



function draw(){


		for (var i=0, j=0; i<=1; i+=.01, j++){ // this produces the default dots, does not read dots
			var rad=sqrt(i*(32*32)/PI);


			ellipseMode(RADIUS);
			noStroke();
			fill(0);
			ellipse(width/2, 16+j*32, rad, rad);
			noFill();
			stroke(255,0,0);
			rect(0,j*32, 32, 32);

			var pArea=((PI)*(rad)*(rad))/(32*32);
			 // i want to go from 0 to 100 so ((32^2/PI)*(percentage))^.5=rad

			console.log(i,j,rad, pArea);

		};



}