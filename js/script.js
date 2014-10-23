
//THREE.JS
	var container, stats;
	var width = window.innerWidth, height = window.innerHeight;
	var camera, scene, projector, renderer, controls;
	var keyboard = new KeyboardState();
	var clock = new THREE.Clock();
	var mesh;

	var radius = 600;
	var theta = 0;

	var duration = 2000;
	var keyframes = 49 /*16*/, interpolation = duration / keyframes, time;
	var lastKeyframe = 0, currentKeyframe = 0;
	var influcence = 1, downInf = false, upInf = false;


	//new
	var outsideBulb, insideBulb;
	var lightBulbMat;
	var lightSource;
	var glow;
	var ground;

	//MAN
	var head, body, hR1, hR2, hL1, hL2, lR1, lR2, lL1, lL2;
	var joints = [];
	var jointsPos = [
		new THREE.Vector3(0, 4, 0),		//neck
		new THREE.Vector3(0, -4, 0),	//body
		new THREE.Vector3(10, 4, 0),	//HR1
		new THREE.Vector3(5, 4, 0),		//HR2
		new THREE.Vector3(-10, 4, 0),	//HL1
		new THREE.Vector3(-5, 4, 0),	//HL2
		new THREE.Vector3(3, -16, 0),	//LR1
		new THREE.Vector3(3, -10, 0),	//LR2
		new THREE.Vector3(-3, -16, 0),	//LL1
		new THREE.Vector3(-3, -10, 0)	//LL2
	];

	//
	var cubeMan;

//GUI
	var jointController = function(){

		// this.joint = [ 'head', 'body', 
		// 			   'rightHand1', 'rightHand2', 'leftHand1', 'leftHand2', 
		// 			   'rightLeg1', 'rightLeg2', 'leftLeg1', 'leftLeg2' ];
		this.unit = 0;
		// this.rotationX = 0;
		// this.rotationY = 0;
		// this.rotationZ = 0;

		this.positionX = 0;
		this.positionY = 0;
		this.positionZ = 0;
	};
	var gui;


//////////////////////////////////////////////////

// window.load = initAudio;
init();
animate();

//////////////////////////////////////////////////

function init() {


	//SET_UP
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set(0,0,30);

	scene = new THREE.Scene();

	var loader = new THREE.JSONLoader( true );


	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 1, 1, 0 );
	scene.add( directionalLight );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 0.3, 0, 1 );
	scene.add( directionalLight );

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( -0.3, 0, -1 );
	scene.add( directionalLight );

	var groundGeo = new THREE.PlaneGeometry(500, 500);
	// groundGeo.computeFaceNormals();	
	mat  = new THREE.MeshLambertMaterial( {color: 0xd82e27, side: THREE.DoubleSide} );
	ground = new THREE.Mesh(groundGeo, mat);
	ground.position.y = -5;
	ground.rotation.x = Math.PI/2;
	// scene.add(ground);


	//STICK_FIGURE
	buildStickFigure();

	var modelMaterial = new THREE.MeshFaceMaterial;
	// loadModelRig("models/knight.js", modelMaterial);
	// loadModelRig("models/spock_rig_export4.js", modelMaterial);


	//RENDERER
		// renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
		renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
		renderer.setClearColor(0x000000, 1);
		renderer.sortObjects = false;
		renderer.autoClear = true;
		renderer.setSize( width, height );
		container.appendChild(renderer.domElement);
		window.addEventListener( 'resize', onWindowResize, false );

	//

	controls = new THREE.OrbitControls(camera, renderer.domElement);

	//

	//STATS
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '5px';
		stats.domElement.style.zIndex = 100;
		stats.domElement.children[ 0 ].style.background = "transparent";
		stats.domElement.children[ 0 ].children[1].style.display = "none";
		container.appendChild(stats.domElement);


}

function buildStickFigure(){
	
	// var headGeo = new THREE.SphereGeometry(4,16,16);
	var headGeo = new THREE.TetrahedronGeometry(6);
	transY(headGeo, 4);
	var manMat = new THREE.MeshLambertMaterial({color: 0xe7d7b7});
	head = new THREE.Mesh(headGeo, manMat);
	head.rotation.y = 45 * (Math.PI/180);
	head.position.set(0,5,0);
	scene.add(head);

	var bodyGeo = new THREE.BoxGeometry(1,1,8);
	var bG = bodyGeo.clone();
	transZ(bG, 4);
	body = new THREE.Mesh(bG, manMat);
	body.position.copy(jointsPos[1]);
	scene.add(body);


	//ARM
		var armGeo = new THREE.BoxGeometry(1,1,4);
		var aG = armGeo.clone();
		transZ(aG, 3);
		hL2 = new THREE.Mesh(aG, manMat);
		hL2.position.set(0,4,0);
		scene.add(hL2);

		aG = armGeo.clone();
		transZ(aG, 3);
		hL1 = new THREE.Mesh(aG, manMat);
		hL1.position.set(-5,4,0);
		scene.add(hL1);

		aG = armGeo.clone();
		transZ(aG, 3);
		hR2 = new THREE.Mesh(aG, manMat);
		hR2.position.set(0,4,0);
		scene.add(hR2);

		aG = armGeo.clone();
		transZ(aG, 3);
		hR1 = new THREE.Mesh(aG, manMat);
		hR1.position.set(5,4,0);
		scene.add(hR1);

	//LEG
		var legGeo = new THREE.BoxGeometry(1,1,5);
		var lG = legGeo.clone();
		transZ(lG, 3);
		lL2 = new THREE.Mesh(lG, manMat);
		// lL2.rotation.z = -20 * (Math.PI/180);
		// lL2.position.set(-2,-7,0);
		scene.add(lL2);

		lG = legGeo.clone();
		transZ(lG, 3);
		lL1 = new THREE.Mesh(lG, manMat);
		// lL1.position.set(-3,-13,0);
		scene.add(lL1);

		lG = legGeo.clone();
		transZ(lG, 3);
		lR2 = new THREE.Mesh(lG, manMat);
		// lR2.rotation.z = 20 * (Math.PI/180);
		// lR2.position.set(2,-7,0);
		scene.add(lR2);

		lG = legGeo.clone();
		transZ(lG, 3);
		lR1 = new THREE.Mesh(lG, manMat);
		// lR1.position.set(3,-13,0);
		scene.add(lR1);

	//JOINTS
		var jointGeo = new THREE.SphereGeometry(1,8,8);
		var jointMat = new THREE.MeshLambertMaterial({color: 0x01eed8});

		for(var i=0; i<jointsPos.length; i++){
			var j = new THREE.Mesh(jointGeo.clone(), jointMat);
			j.position.copy(jointsPos[i]);
			joints.push(j);
			scene.add(j);
		}


	setupStickmanGui();
}

var moveDistance = 10;

function setupStickmanGui() {

	var manJoint = new jointController();
	gui = new dat.GUI();
	// gui.remember(manJoint);

	var singleJoint = joints[manJoint.unit];

	// var f0 = gui.addFolder('System');
	// f0.addPresets();

	var f1 = gui.addFolder('Joints Position');
	
	var jointU = f1.add(manJoint, 'unit', 0, joints.length-1).step(1);
	jointU.onChange( function( value ){ singleJoint = joints[ value ]; } );

	var jointPX = f1.add(manJoint, 'positionX',-10, 10);
	jointPX.onChange( function( value ){ singleJoint.position.x = value; } );

	var jointPY = f1.add(manJoint, 'positionY', -10, 10);
	jointPY.onChange( function( value ){ singleJoint.position.y = value; } );

	var jointPZ = f1.add(manJoint, 'positionZ', -10, 10);
	jointPZ.onChange( function( value ){ singleJoint.position.z = value; } );

	f1.open();
}


function setupGui() {

	var jointParameters = new jointController();
	gui = new dat.GUI();

	var figureBones = cubeMan.skeleton.bones;
	var singleFigureBone = figureBones[jointParameters.unit];

	var f1 = gui.addFolder('Rotation');
	
	var jointU = f1.add(jointParameters, 'unit', 0, figureBones.length-1).step(1);
	jointU.onChange( function( value ){ singleFigureBone = figureBones[ value ]; } );

	var jointRX = f1.add(jointParameters, 'rotationX', -Math.PI/2, Math.PI/2);
	jointRX.onChange( function( value ){ singleFigureBone.rotation.x = value; } );

	var jointRY = f1.add(jointParameters, 'rotationY', -Math.PI/2, Math.PI/2);
	jointRY.onChange( function( value ){ singleFigureBone.rotation.y = value; } );

	var jointRZ = f1.add(jointParameters, 'rotationZ', -Math.PI/2, Math.PI/2);
	jointRZ.onChange( function( value ){ singleFigureBone.rotation.z = value; } );

	f1.open();
}



function finishedLoading(bufferList){
	analyzer = context.createAnalyser();
	analyzer.smoothingTimeConstant = 0.8;	//
	analyzer.fftSize = samples;
	binCount = analyzer.frequencyBinCount;
	levelBins = Math.floor(binCount/levelCount);

	frequencyByteData = new Uint8Array(binCount);
	timeByteData = new Uint8Array(binCount);

	var length = 256;
	for(var i=0; i<length; i++){
		levelHistory.push(0);
	}

	source = context.createBufferSource();
	gainNode = context.createGain();

	source.buffer = bufferList[0];
	source.loop = true;

	source.connect(analyzer);
	analyzer.connect(gainNode);
	gainNode.connect(context.destination);

	gainNode.gain.value = 0.5;

	source.start(0);
	isPlayingAudio = true;
}

function transX(geo, n){
	for(var i=0; i<geo.vertices.length; i++){
		geo.vertices[i].x += n;
	}
}

function transZ(geo, n){
	for(var i=0; i<geo.vertices.length; i++){
		geo.vertices[i].z += n;
	}
}

function transY(geo, n){
	for(var i=0; i<geo.vertices.length; i++){
		geo.vertices[i].y += n;
	}
}

function scaleGeo(geo, s){
	for(var i=0; i<geo.vertices.length; i++){
		var gg = geo.vertices[i];
		// console.log(gg);
		gg.multiplyScalar(s);
	}
	geo.__dirtyVertices = true;
}


function onBeat(){
	gotBeat = true;
}

function noteFromPitch(frequency){
  var noteNum = 12*(Math.log(frequency/440)/Math.log(2));
  return Math.round(noteNum)+69;
}

function freqencyFromNote(note){
  return 440* Math.pow(2, (note+69)/12);
}

function centsOffFromPitch(frequency){
  return ( 1200 * Math.log(frequency/freqencyFromNote(note) ) / Math.log(2) );
}

function updatePitch(time){
	var cycles = [];
	analyser.getByteTimeDomainData(buf);
	// autoCorrelate(buf, audioContext.sampleRate);
}



function loadModelRig (model, meshMat) {

	var loader = new THREE.JSONLoader();
	loader.load(model, function(geometry, materials){

		for ( var i = 0; i < materials.length; i ++ ) {
			var m = materials[ i ];
			m.skinning = true;
			// m.wrapAround = true;
		}

		// var cubeManMat = new THREE.MeshLambertMaterial ({color: 0xaaaa00, skinning: true});
		cubeMan = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
		// cubeMan = new THREE.SkinnedMesh(geometry, cubeManMat);

		// cubeManMat = cubeMan.material.materials;

		// for(var i=0; i<materials.length; i++){
		// 	var matt = materials[i];
		// 	matt.skinning = true;
		// }

		
		scene.add(cubeMan);

		setupGui();
			
	}, "js");
}



function animate() {

	requestAnimationFrame( animate );

	update();
	render();
}

function render() {
	renderer.render( scene, camera );
}




var step=0, danceStep = 0;
var vecHeadToBody;
var vecCenter = new THREE.Vector3(0,1,0);

function update(){

	var delta = clock.getDelta();
	var timeNow = Date.now() * 0.00025;


	keyboard.update();
	controls.update();
	stats.update();


//==================================================================

	//STICK_MAN
		var vecTmp = new THREE.Vector3();

		//HEAD
			head.position.copy(joints[0].position);

		//BODY
			vecHeadToBody = vecTmp.subVectors(joints[0].position, joints[1].position).normalize();
			// var rotBody = vecHeadToBody.angleTo(vecCenter);

			body.lookAt(joints[0].position);
			body.position.copy(joints[1].position);

		//LEFT_HAND
			hL2.lookAt(joints[5].position);
			hL2.position.copy(joints[0].position);

			hL1.lookAt(joints[4].position);
			hL1.position.copy(joints[5].position);

		//RIGHT_HAND
			hR2.lookAt(joints[3].position);
			hR2.position.copy(joints[0].position);

			hR1.lookAt(joints[2].position);
			hR1.position.copy(joints[3].position);

		//LEFT_LEG
			lL2.lookAt(joints[9].position);
			lL2.position.copy(joints[1].position);

			lL1.lookAt(joints[8].position);
			lL1.position.copy(joints[9].position);

		//RIGHT_LEG
			lR2.lookAt(joints[7].position);
			lR2.position.copy(joints[1].position);

			lR1.lookAt(joints[6].position);
			lR1.position.copy(joints[7].position);

//==================================================================

	window.onmousedown = function(event){

		// var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		// var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		var posX = event.clientX;
		var posY = event.clientY;
		
		// if(posX>width/2 && posY<height/2)
		// 	console.log("2");

		// if(posX<width/2 && posY<height/2)
		// 	console.log("1");

		// if(posX<width/2 && posY>height/2)
		// 	console.log("3");

		// if(posX>width/2 && posY>height/2)
		// 	console.log("4");


		/*
		var vecMouse = new THREE.Vector2(posX-width/2, posY-height/2);
		vecMouse.normalize();

		var angle = Math.atan2(vecMouse.y, vecMouse.x) - Math.atan2(1, 0);
		if (angle < 0) angle += 2 * Math.PI;
		angle *= (180/Math.PI);

		console.log(angle);

		cubeMan.skeleton.bones[3].rotation.y = angle;
		*/

		// var posX = event.clientX;
		// var posY = event.clientY;
		
		
		// var vecMouse = new THREE.Vector2(posX-width/2, posY-height/2);
		// vecMouse.normalize();

		// var angle = Math.atan2(vecMouse.y, vecMouse.x) - Math.atan2(1, 0);
		// if (angle < 0) angle += 2 * Math.PI;
		// angle *= (180/Math.PI);

		// cubeMan.skeleton.bones[3].rotation.y = angle;
	}

	window.onmousemove = function(event){

		// var posX = event.clientX;
		// var posY = event.clientY;
		
		
		// var vecMouse = new THREE.Vector2(posX-width/2, posY-height/2);
		// vecMouse.normalize();

		// var angle = Math.atan2(vecMouse.y, vecMouse.x) - Math.atan2(1, 0);
		// if (angle < 0) angle += 2 * Math.PI;
		// angle *= (180/Math.PI);

		// cubeMan.skeleton.bones[3].rotation.y = angle;
		

		//3,5
	}

}






function onWindowResize(){
	width = window.innerWidth;
	height = window.innerHeight;

	camera.aspect = width/height;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}