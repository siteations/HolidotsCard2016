var width;
var heigth;

var img;
var imgSet=[];
var imgSetUrl=[];

var cnt;
var mX;
var mY;
var fontRegular;
var test;
var test2;

// icons in both versions
var iconSnow=[];
var iconAnimals=[];
var iconOrnaments=[];
//
var snowPng=[];
var winterPng=[];
var ornamentsPng=[];
var treatsPng=[];
var miscPng=[];

// color black to green
var reds=["#000000","#140000","#270000", "#3b0000", "#4e0000", "#620000","#890000","#9d0000", "#c40000","#d80000","#eb0000","#ff0000"];
var greens=["#000000","#000a00","#001e00", "#003200", "#004500", "#005900","#006c00","#008000", "#009400","#00a700","#00bb00","#00ce00"];							
var huePix=[reds,greens];

var icons;
var option;
var grid;//placeholder for user grid selection

var pixSize;
var gridsize;
var pixCount;
var endCount=0;

var holder=[];//active canvas figures/active svg shapes
var underHolder=[]//underlay pixels
var resampleHolder=[]//resampled grids
var loops;

var gifFrames=[];
var gifReady=[];
var gifFrReverse=[];

var bool=0;
var copyCnt=0;

function preload() { // this will actually need to be the feeder from camera...
  //take_snapshot();

  	test=loadImage('img/holiday2016.jpg');
  	//---------------------------all background winter images------------------
  	for (var i=0;i<9;i++){
		imgSet.push(loadImage("img/winter"+(i+1)+".jpg"));
		imgSetUrl.push("img/winter"+(i+1)+".jpg");
	};

  	//-----------------all png icons for canvas/gif series---------------------
  	for (var i=0;i<10;i++){
		snowPng.push(loadImage("icon/snow/"+i+".png"));
		winterPng.push(loadImage("icon/winter/"+i+".png"));
		ornamentsPng.push(loadImage("icon/ornaments/"+i+".png"));
		treatsPng.push(loadImage("icon/treats/"+i+".png"));
	};

	miscPng=snowPng.concat(winterPng, ornamentsPng, treatsPng);
	console.log(miscPng);


  	//-----------------all svg icons for d3/svg series---------------------
	/*for (var i=0;i<10;i++){
		iconSnow.push("img/snow/"+i+".svg");
	};*/

  fontRegular = loadFont("img/UnicaOne-Regular.ttf");

}

function setup() {

	frameRate(2);
	loops=0;
	  
	width=1200;
  	height=600;

	cnt=createCanvas(width, height); 
  		cnt.parent('results');
  		cnt.id('pixelCanvas');

  	pixSize=[];
  	for (var num=0; num<60; num++){
  		if (width%num===0 && 600%num===0){
  			pixSize.push(num);
  		}
  	}
  	
  	pixSize=pixSize.slice(4);

  	pixelDensity(1);
  	gridsize=0;
  	pixCount=0;

}


function draw() {

if (!option){option='mixed';};

if (option==='mixed'){iconSeries=miscPng;};
if (option==='snow'){iconSeries=snowPng;};
if (option==='winter'){iconSeries=winterPng;};
if (option==='ornaments'){iconSeries=ornamentsPng;};
if (option==='treats'){iconSeries=treatsPng;};

		document.getElementById("loader").onclick=function() {
			radioClicked();
		    reloading();
		};

		document.getElementById("pause").onclick=function() {
			playpause();
		};


loops++;


if (holder.length<12){

	grid=pixSize[gridsize];
	//default image vs. winterSet vs. various uploads/camera grabs....
	if (!img){img=test;};
	//if (!img){img=imgSet[0];};

	image(img, 0, 0); 
  	loadPixels(); 

  	underHolder.push(pixels); // underHolder logs background
  	

  	// could use this then restructure, but makes more sense to use get() and structure averages
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

  		pixGr.push((pixels[i]+pixels[i+1]+pixels[i+2])/3); //slightly darker average...
  		pixNest.push(hsl);	
  	}

  	// restructure that list into rows.... slice array @ width and push to new container
  	for (var i=0; i<pixGr.length; i+=width){
  		pixGRow.push(pixGr.slice(i,i+width));
  		pixNRow.push(pixNest.slice(i,i+width));
  	}




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

		resampleHolder.push(pixRe);

		//clear for svg use only... layer in canvas
		/*$('#pixelsvg').remove();
		$('#pixelCanvas').remove();

		var svg=d3.select('#results').append('svg')
			.attr('id', 'pixelsvg')
			.attr('width', width)
			.attr('height', height)
			.attr('fill', "#ffffff");*/	

		var iteration=[];

		pixRe.forEach(function (line, j){ //j*grid=y
			line.forEach(function (newpix, i){ //i*grid=x

				var perc=1-(newpix/255);
				var rad=sqrt(perc*(grid*grid)/PI);
				var sel=floor(random(0,2));
				var icon=iconSeries[floor(random(0,iconSeries.length))];
				var r=floor(random(1,gridsize+1));
				//var icon=iconSnow[floor(random(0,10))];

				//processing version
				fill(255);
				noStroke();
				rect(i*grid, j*grid, grid, grid);

				ellipseMode(RADIUS);
				noStroke();
				fill(huePix[sel][r]);
				ellipse(i*grid+grid/2, j*grid+grid/2, rad, rad);

				if (rad>=6){
					push();
					translate(i*grid+grid/2, j*grid+grid/2);
					imageMode(CENTER);
					image(icon,0,0,rad, rad);
					pop();
				};

				var pixPair={}; //everything needed for recreation
					pixPair.cx=i*grid+grid/2;
					pixPair.cy=j*grid+grid/2;
					pixPair.x=i*grid;
					pixPair.y=j*grid;
					pixPair.r=rad;
					pixPair.pixel=grid;
					pixPair.fill=huePix[sel][gridsize];
					pixPair.icon = icon;

				iteration.push(pixPair);

			});
		});

		iteration.gridsize = gridsize;
		iteration.pixSize = pixCount;
		holder.push(iteration);

	} else { 

		frameRate(4);

		var intensity=resampleHolder[resampleHolder.length-1];
		var finalLoop=holder[holder.length-1];
		gridsize=finalLoop.gridsize;
		pixCount=finalLoop.pixCount;

		//$('#greeting')[0].style.color="red";
		//$('#wishes')[0].style.color="red";

		endCount=0;

		//processing version
		finalLoop.forEach(function(pixelcode){

			if (Number(pixelcode.r)>=34){
				endCount++;
			};

			var r=floor(random(1,reds.length));
			var colors=floor(random(0,2));
			var icon2=iconSeries[floor(random(0,iconSeries.length))];

			if (!pixelcode.rp){pixelcode.rp=pixelcode.r;};

			if (pixelcode.r<34){
				pixelcode.r=Number(pixelcode.r)+3;
			}

				ellipseMode(RADIUS);
				noStroke();
				fill(huePix[colors][r]);
				ellipse(pixelcode.cx, pixelcode.cy, pixelcode.r, pixelcode.r);

				push();
				translate(pixelcode.cx, pixelcode.cy);
				imageMode(CENTER);
				image(icon2,0,0,pixelcode.r, pixelcode.r);
				pop();

		});
	};

	blobImage(); // save canvas as image for gif-making

		if (gridsize<pixSize.length-1){
			gridsize++;
			//gridsize=floor(random(0,pixSize.length));
		} else if (gridsize===pixSize.length-1 && pixCount<imgSet.length-1){
			gridsize=0;
			pixCount++;
		} else if (gridsize===pixSize.length-1 && pixCount===imgSet.length-1|| endCount===finalLoop.length){
			//reverse copy

		gifReady=gifFrames.concat(gifFrReverse);

		/*document.getElementById("gif").onclick=function() {
			gifMake();
		};

		
			gifshot.createGIF({
			    gifWidth: 1200,
			    gifHeight: 600,
			    images: gifReady,
			    interval: 0.25,
			    numFrames: copyCnt
			}, function (obj) {
			    if (!obj.error) {
			        var image = obj.image, animatedImage = document.createElement('img');
			        animatedImage.src = image;
			        animatedImage.id = 'gifOutput';
			        animatedImage.style = "width: 900px; margin-top:20px";

			        //document.body.appendChild(gifImage);
			        $('.hideMe2').append(animatedImage);
			    } else {
			    	console.log(obj.error);
			    }
			}); */


			noLoop();
			bool=1;

		};

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

		preview(data_uri);

		img = loadImage(data_uri);
				
	});

	bool=0;
	//resizeCanvas(width, height);

};

function take_winter() {

	var a=floor(random(0,9));
	img=imgSet[a];
	d3.select('#winter').attr("name", a);
	d3.select('#random-value').text(" (scene "+(a+1)+")");
	bool=0;

	preview(imgSetUrl[a]);

};


function take_upload(file){

  var reader = new FileReader();

  // inject an image with the src url
  reader.onload = function(event) {
    the_url = event.target.result;
    img = loadImage(the_url);

    preview(the_url);
    
  };

  reader.readAsDataURL(file);
  bool=0;

};

function preview(newurl){

	$("#my_preview").empty();

		var newImg = document.createElement("img"),
		      url = newurl;

		  newImg.onload = function() {
		    // no longer need to read the blob so it's revoked
		    URL.revokeObjectURL(url);
		  };

  		newImg.src = url;
  		newImg.style="width:300px; overflow:hidden; ";
		$("#my_preview").append(newImg);

}

function saveJPG(){
	save(cnt, 'yourImage.jpg');
}

function savePNG(){
	save(cnt, 'yourImage.png');
}

function copyPNG(){
	var canvas = document.getElementById("pixelCanvas");

	//var dataURL = canvas.toDataURL();
	//console.log(dataURL);

	var imagery=canvas.toBlob(function(blob) {
	  var newImg = document.createElement("img"),
	      url = URL.createObjectURL(blob);
	      
	    newImg.onload = function() {
    // no longer need to read the blob so it's revoked
    URL.revokeObjectURL(url);
  };

  	newImg.src = url;
  	newImg.id = 'copyImage'+copyCnt;
  	copyCnt++;
  	newImg.style = "width: 600px";
  	//newImg.style = "visibility: hidden";
  	$('.hideMe').append(newImg);
  	//document.body.appendChild(newImg);
	//return url;
	});

	console.log(imagery);	
	return imagery;
	
};

function radioClicked() {
	var opts=(document.getElementsByName('Opt'));

	opts.forEach(function(button){
		if (button.checked){
			option = button.value;
		};
	});

	console.log(option);
};

function playpause() {
	if (bool%2===0){
		noLoop();
		bool=1;
	} else if (bool%2!==0){
		loop();
		bool=0;
	}
};

function reloading() {

	gridsize=0;
  	pixCount=0;
  	endCount=0;
  	holder=[];
  	loop();
  	gifFrames=[];
  	gifFrReverse=[];
  	$('.hideMe').empty();
  	$('.gifPlaced').empty();

  	$('#change')[0].innerHTML='your gif will appear below when rendered...';
  	$('#change')[0].style.color="black";

  	copyCnt=0;
  	/*document.getElementById("pause").onclick=function() {
			playpause();
		};*/
	resizeCanvas(width, height);

};

function blobImage(){
var canvas = document.getElementById("pixelCanvas");

canvas.toBlob(function(blob) {
  var newImg = document.createElement("img"),
      url = URL.createObjectURL(blob);

  newImg.onload = function() {
    // no longer need to read the blob so it's revoked
    URL.revokeObjectURL(url);
  };

  newImg.src = url;
  	newImg.id = 'copyImage'+copyCnt;
  	copyCnt++;
  	newImg.style = "width: 40px; margin:10 10 0 0;visibility: hidden";
  	$('.hideMe').append(newImg);
  gifFrames.push(newImg);
  gifFrReverse.unshift(newImg);// so there is a running queue for giffing
	});
}

function gifMake() {
			gifshot.createGIF({
			    gifWidth: 900,
			    gifHeight: 450,
			    images: gifReady,
			    interval: 0.1,
			    numFrames: copyCnt
			}, function (obj) {
			    if (!obj.error) {
			        var image = obj.image, animatedImage = document.createElement('img');
			        animatedImage.src = image;
			        animatedImage.id = 'gifOutput';
			        animatedImage.style = "width: 900px; margin-top:20px";

			        //document.body.appendChild(gifImage);
			        $('.gifPlaced').empty();
			        $('#change')[0].innerHTML="your gif is ready";
			        $('#change')[0].style.color="red";
			        $('.gifPlaced').append(animatedImage);
			    } else {
			    	console.log(obj.error);
			    }
			});
}

