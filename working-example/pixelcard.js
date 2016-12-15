var width;
var w2; // for double density
var heigth;
var wCenter;
var img;
var img2=[];
var img3,img4,img5,img6,img7,img8,img9,img10,img11,img12;
var greeting="";
var cnt;

var icons;
var grid;//placeholder for user grid selection
var dens;
var pixSize;

function preload() { // this will actually need to be the feeder from camera...
  //take_snapshot();
  img = loadImage("img/test.jpg");
  img3=loadImage("img/winter"+1+".jpg");
  img4=loadImage("img/winter"+2+".jpg");
  img5=loadImage("img/winter"+3+".jpg");
  img6=loadImage("img/winter"+4+".jpg");
  img7=loadImage("img/winter"+5+".jpg");
  img8=loadImage("img/winter"+6+".jpg");
  img9=loadImage("img/winter"+7+".jpg");
  img10=loadImage("img/winter"+8+".jpg");
  img11=loadImage("img/winter"+9+".jpg");
  //img12=loadImage("img/winter"+10+".jpg");
  //icons as array of objects, 0-100, with each as []{ wreath:'img/linkhere.svg', ornament:'img/linkhere.svg', etc.}
  //perhaps automate that preloaded object in a different area and simply load all here;
}

function setup() {

	img2=[img3,img4,img5,img6,img7,img8,img9,img10,img11];
	  
	console.log(img2);
	dens=1;
	width =800;
  	height=600;
	w2=width*dens;
	wCenter=(displayWidth-width)/2;


	cnt=createCanvas(width, height); // the canvas
  		cnt.position(wCenter+160, 180);
  		cnt.parent('results');
  		cnt.id('pixelCanvas');

  	pixSize=[];
  	for (var num=0; num<50; num++){
  		if (800%num===0 && 600%num===0){
  			pixSize.push(num);
  		}
  	}
  	console.log(pixSize);
  	console.log(this);

  	pixelDensity(dens);
  	noLoop(); 
  	grid=8;// double density for better icons intensity, camera grabs


}

function draw(grid) {

		// various inputs check for activity

		document.getElementById("own").onchange=function() {
		    console.log('uploaded file:'+ this.files[0].name);
		    take(this.files[0]);
		};

		document.getElementById("winter").onclick=function() {
		    console.log('winter random');
		    take_winter();
		};

		document.getElementById("camera").onclick=function() {
		    console.log('camera');
		    take_snapshot();
		};


	//rework for grid...

	var gridTest=8;

	pixSize.forEach(function (size, i){
		if (grid===size){
			return gridTest=size;
		} else if (grid>size && grid<pixSize[i+1]){
			return gridTest=size;
		}
	});

	grid=gridTest||8;

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
  	//grid=8||nSqr;



		pixGRow.forEach(function(row, i){
			var avgH=[]; //horizontal averages

			for (var i=0; i<row.length; i+=grid){
				var avg=(Math.floor(d3.mean(row.slice(i,i+grid))));
				avgH.push(avg);
			};
			pixRHG.push(avgH);
  		});


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
				// GREY SOLID INFILL VERSION
				/*
				fill(newpix);
				noStroke();
				rect(i*grid, j*grid, grid, grid); 
				*/

				//DEFAULT DOT VERSION

				var perc=1-(newpix/255);
				var rad=sqrt(perc*(grid*grid)/PI);

				fill(255);
				noStroke();
				rect(i*grid, j*grid, grid, grid);

				ellipseMode(RADIUS);
				noStroke();
				fill(0);
				ellipse(i*grid+grid/2, j*grid+grid/2, rad, rad);

				//LOAD ICONS VERSION


			});
		});

	};

fbimage();

}


/*function mousePressed() {
	//resizeCanvas(width, height);	
   	//take_snapshot();
   	//if (a){img= loadImage("img/test.jpg");};
   console.log(img);
   //loop();
   //draw();
 }*/


function take_snapshot() {
	// take snapshot and get image data

	Webcam.snap(function(data_uri) {
		// display results in page
		//document.getElementById('results').innerHTML = 
			//'<img id="camImg" src=" "/>';
			//'<img id="camImg" src="'+data_uri+'"/>';
		img = loadImage(data_uri);
		
	} );
	grid=d3.select('#nSqr-value')[0][0].innerHTML;
	resizeCanvas(width, height);
	return grid;
};

function take_winter() {
	// take snapshot and get image data
	//resizeCanvas(width, height);
	var a=floor(random(0,9));
	//img = loadImage("img/winter"+a+".jpg");
	img=img2[a];
	d3.select('#winter').attr("name", a);
	grid=d3.select('#nSqr-value')[0][0].innerHTML;
	d3.select('#random-value').text(" (scene "+(a+1)+")");
	resizeCanvas(width, height);
	return grid;
};


function take(file){

  var reader = new FileReader();

  // inject an image with the src url
  reader.onload = function(event) {
    the_url = event.target.result;
    img = loadImage(the_url);
    console.log('file loaded');

	grid=d3.select('#nSqr-value')[0][0].innerHTML;
	resizeCanvas(width, height);
	return grid;
  };
  reader.readAsDataURL(file);
};

function saveJPG(){
	save(cnt, 'myCanvas.jpg');
}

function copyPNG(){
	//save(cnt, 'myCanvas.jpg');
	var pasteEvent = new ClipboardEvent('paste');
	pasteEvent.clipboardData.items.add('My string is copied', 'text/plain');
	document.dispatchEvent(pasteEvent);
	console.log('pasted');
	
}

function fbimage(){

	console.log(cnt);

	var canvasOut = document.getElementById("pixelCanvas");

	canvasOut.toBlob(function(blob) {
	  	var newImg = document.createElement("img"),
	      url = URL.createObjectURL(blob);

	  newImg.onload = function() {
	    // no longer need to read the blob so it's revoked
	    URL.revokeObjectURL(url);
	  };


  newImg.src = url;
  console.log(newImg.src);
  //blob:http://localhost/01531ffb-e105-1a45-843f-35086c75dabd

  //document.body.appendChild(newImg);
});
	//save(cnt, 'myCanvas.jpg');
	//d3.select(document.head.childNodes[9]).attr("content",'old');//programatically update this
	console.log(document.head.childNodes[9].content);//);
}

function mouseReleased() {
  noLoop();
}

