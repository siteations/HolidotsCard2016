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
  img = loadImage("img/test.jpg");
  //icons as array of objects, 0-100, with each as []{ wreath:'img/linkhere.svg', ornament:'img/linkhere.svg', etc.}
  //perhaps automate that preloaded object in a different area and simply load all here;
}

function setup() {
	dens=1;
	width =img.width;
  	height=img.height;
	w2=width*dens;
	wCenter=(displayWidth-width)/2;


	var cnt=createCanvas(width, height); // the canvas
  		cnt.position(wCenter+120, 140);
  		cnt.parent('results');
  		cnt.id('pixelCanvas');

  	pixelDensity(dens);
  	noLoop(); // double density for better icons intensity, camera grabs


}

function draw() {
if (img){
	image(img, 0, 0); 
  	loadPixels(); // could use this then restructure, but makes more sense to use get() and structure averages
  	var pixNest=[];
  	var pixGr=[];
  	var pixNRow=[];
  	var pixGRow=[];
  	var pixRHG=[];
  	var pixReG=[];
  	var pixRe=[];

  	


  	//image in -> grab pixels and extract lightness into structured array (continuous list)...
  	for (var i=0; i<pixels.length; i+=4){
  		var hsl=[];
  		hsl.push(pixels[i]);
  		hsl.push(pixels[i+1]);
  		hsl.push(pixels[i+2]);
  		// leave off alpha

  		pixGr.push((pixels[i]+pixels[i+1]+pixels[i+2])/3);
  		pixNest.push(hsl);	
  	}

  	console.log(pixGr.length);

  	// restructure that list into rows.... slice array @ width and push to new container
  	for (var i=0; i<pixGr.length; i+=w2){
  		pixGRow.push(pixGr.slice(i,i+w2));
  		pixNRow.push(pixNest.slice(i,i+w2));
  	}

/*  	GREYSCALE TEST

	//with each row an entry (i.e. index= y value)... can iterate thru x values as 'set test'
			  	//console.log(pixGRow.length, width, height);

			  	pixGRow.forEach(function(row, i){
				  		row.forEach(function(pix, j){
				  				set(j/dens,i/dens,color(pix+10));

				  		});
			  	});

			  	updatePixels(); */

	//instead of str8 greyscale... need to pixelate(8x8 grid or 16x16 grid)... adjustable version later	  	
  	grid=8; // this will be variable later.

		pixGRow.forEach(function(row, i){
			var avgH=[]; //horizontal averages

			for (var i=0; i<row.length; i+=grid){
				var avg=(Math.floor(d3.mean(row.slice(i,i+grid))));
				avgH.push(avg);
			};
			pixRHG.push(avgH);
  		});

		console.log(pixRHG.length);
		console.log(pixRHG[0].length);

		for (var rows=0; rows<pixRHG.length; rows+=grid){
			pixReG=[];

			for (var j=0; j<pixRHG[0].length;j++){
				var row=0;

				for (var i=0; i<grid; i++){
					row+=pixRHG[i+rows][j];
				};

				pixReG.push(Math.floor(row/grid));//vertical average 
				// for percentage series this will be row/grid/255... to get % white, 100-this for % black.

			};

			pixRe.push(pixReG); // excellent arranged in rows... each array equals one average row
		};

		// so now we can iterate through drawing squares, fill being set from array

		pixRe.forEach(function (line, j){ //j*grid=y
			line.forEach(function (newpix, i){ //i*grid=x
				fill(newpix);
				noStroke();
				rect(i*grid, j*grid, grid, grid);
			});

		});


};

}


function mousePressed() {
	//resizeCanvas(width, height);	
   	//take_snapshot();
   	//if (a){img= loadImage("img/test.jpg");};
   console.log(img);
   //loop();
   //draw();
 }


function take_snapshot() {
	// take snapshot and get image data
	resizeCanvas(width, height);
	Webcam.snap(function(data_uri) {
		// display results in page
		//document.getElementById('results').innerHTML = 
			//'<img id="camImg" src=" "/>';
			//'<img id="camImg" src="'+data_uri+'"/>';
		img = loadImage(data_uri);
	} );
	draw();

	//img = loadImage(data_uri);
	//console.log(document.getElementById('camImg').src);
}

function take_existing() {
	// take snapshot and get image data
	resizeCanvas(width, height);
	img = loadImage("img/test.jpg");
	draw();

	//img = loadImage(data_uri);
	//console.log(document.getElementById('camImg').src);
}



 function mouseReleased() {
  noLoop();
}
