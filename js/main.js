console.log("el");

//break out three js creation into seperate tab
//add shader
//

var threejsInstance = [];
var assetsPath = "assets/";

function createThreejsInstance(_container, _width, _height){
	// Set the scene size.
	// var width = _width;
	// var height = _height;

	// Set some camera attributes.
	var VIEW_ANGLE = 45;
	var ASPECT = _width / _height;
	var NEAR = 0.1;
	var FAR = 10000;

	// Get the DOM element to attach to
	var container = document.querySelector(_container);

	// Create a WebGL renderer, camera
	// and a scene
	var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	var camera =
	    new THREE.PerspectiveCamera(
	        VIEW_ANGLE,
	        ASPECT,
	        NEAR,
	        FAR
	    );

	var scene = new THREE.Scene();

	// Add the camera to the scene.
	scene.add(camera);

	// Start the renderer.
	renderer.setSize(_width, _height);

	// Attach the renderer-supplied
	// DOM element.
	container.appendChild(renderer.domElement);

	return {container:container, scene:scene, camera:camera, renderer:renderer};
}
var headerInstance = createThreejsInstance('#header-graphic', 1100, 700);
var charretteInstance = createThreejsInstance('#charrette-graphic', 400, 400);
threejsInstance.push(headerInstance);
threejsInstance.push(charretteInstance);
/*
////////////////////////////////////////////////////
//scene
////////////////////////////////////////////////////

// Set the scene size.
const WIDTH = 1100;
const HEIGHT = 700;

// Set some camera attributes.
const VIEW_ANGLE = 45;
const ASPECT = WIDTH / HEIGHT;
const NEAR = 0.1;
const FAR = 10000;

// Get the DOM element to attach to
const container = document.querySelector('#header-graphic');

// Create a WebGL renderer, camera
// and a scene
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const camera =
    new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    );

const scene = new THREE.Scene();

// Add the camera to the scene.
scene.add(camera);

// Start the renderer.
renderer.setSize(WIDTH, HEIGHT);

// Attach the renderer-supplied
// DOM element.
container.appendChild(renderer.domElement);
*/
////////////////////////////////////////////////////
//lights
////////////////////////////////////////////////////

// create a point light
const pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = -200;
pointLight.position.y = 150;
pointLight.position.z = 130;

// add to the scene
headerInstance.scene.add(pointLight);

// const pointLight2 =
//   new THREE.PointLight(0xFFFFFF);

// // set its position
// pointLight2.position.x = -200;
// pointLight2.position.y = 150;
// pointLight2.position.z = 130;


// charretteInstance.scene.add(pointLight2);

////////////////////////////////////////////////////
//header
////////////////////////////////////////////////////
var spheres=[];

var mesh_sketching;
var mesh_in;
var mesh_hardware;
function initHeader(){
	for(var i=0; i<80; i++){
		var s = addSphere(randRange(10, 40), .1, headerInstance);

		s.position.x = randRange(-200, 200);
		s.position.y = randRange(-80, 100);
		s.position.z = randRange(-400, -500);

		s.rSpeed = new THREE.Vector3(randRange(-1,1), randRange(-1,1), randRange(-1,1));
		spheres.push(s);
	}
	//load in sketching text
	var loader = new THREE.OBJLoader();

	// load a resource
	loader.load(
		// resource URL
		assetsPath+ 'sk2017_lockup_v2.obj',
		// Function when resource is loaded
		function ( object ) {
			headerInstance.scene.add( object );
			
			
			object.position.x = -20;
			object.position.y = 20;
			object.position.z = -250;
			object.scale.set(100,100,100);
			object.traverse( function ( child ) {

        		if ( child instanceof THREE.Mesh ) {

					child.material = shaderMaterial;
					// console.log('mesh: '+child.name);
					if(child.name.indexOf('Sketching_Mesh')>-1){
						mesh_sketching = child;
						console.log('found' + child.name);
					}
					if(child.name.indexOf('in_Mesh')>-1){
						mesh_in = child;
					}
					if(child.name.indexOf('Hardware_Mesh')>-1){
						mesh_hardware = child;
					}
				}

			});
			//object.material = shaderMaterial;
		}
	);
}



function addSphere(_radius, _vertDistort, _instance){
	//create a sphere
	//warp it
	//then add to scene
	//return it

	// Set up the sphere vars
	var RADIUS = _radius;
	var SEGMENTS = 6;
	var RINGS = 6;

	// Create a new mesh with
	// sphere geometry - we will cover

	// create the sphere's material
	// var sphereMaterial =
	//   new THREE.MeshLambertMaterial(
	//     {
	//       color: 0xeeff16,
	//       shading: THREE.FlatShading
	//     });

	var sphere = new THREE.Mesh(

	  new THREE.SphereGeometry(
	    RADIUS,
	    SEGMENTS,
	    RINGS),

	  shaderMaterial);

	if(_vertDistort>0){
		for(var v=0; v<sphere.geometry.vertices.length; v++){
			var val = 1 + randRange(-_vertDistort, _vertDistort);
			sphere.geometry.vertices[v].x = sphere.geometry.vertices[v].x *val;
			sphere.geometry.vertices[v].y = sphere.geometry.vertices[v].y *val;
			sphere.geometry.vertices[v].z = sphere.geometry.vertices[v].z *val;
			// sphere.geometry.vertices[v].y+=randRange(-_vertDistort, _vertDistort);
			// sphere.geometry.vertices[v].z+=randRange(-_vertDistort, _vertDistort);
		}
		sphere.geometry.computeFlatVertexNormals();
		sphere.geometry.verticesNeedUpdate = true;
	}

	// Finally, add the sphere to the scene.
	_instance.scene.add(sphere);
	return sphere;
}

////////////////////////////////////////////////////
//charrette graphic
////////////////////////////////////////////////////
var testsphere;

var colorMapLoader = new THREE.TextureLoader();
//shader
var vShader = $('#vertexshader');
var fShader = $('#fragmentshader');

var uniforms = {};
// var attributes = {};

//load in texture for uniforms
//*
var uniforms = {
    texture1: { type: "t", value: colorMapLoader.load( assetsPath + 'cubecolormap4.jpg' , function (texture) {
    	texture.wrapS = THREE.RepeatWrapping;
    	texture.wrapT = THREE.RepeatWrapping;
    	texture.minFilter = THREE.LinearFilter;
    	texture.needsUpdate = true;
    	//texture.generateMipmaps=false;
    	console.log(texture);
    }) }
};
//*/
/*
uniforms:       uniforms,
attributes:     attributes
*/

var shaderMaterial =
new THREE.ShaderMaterial({
	uniforms:       uniforms,
	vertexShader:   vShader.text(),
	fragmentShader: fShader.text()
});

function initCharrette(){
	testsphere = addSphere(40, 0, charretteInstance);
	testsphere.position.x = 100;
	testsphere.position.z = -400;
	testsphereB = addSphere(60, 0, charretteInstance);
	testsphereB.position.x = -80;
	testsphereB.position.z = -400;

	
	// testsphere.material =shaderMaterial;
	// testsphereB.material =shaderMaterial;


	testCubeA = new THREE.Mesh(

	  new THREE.BoxGeometry(
	    90, 90, 90),

	  shaderMaterial);
	charretteInstance.scene.add(testCubeA);
	testCubeA.position.z = -400;
}
var testCubeA;
$(document).ready(function(){
	initCharrette();
	initHeader();
	// Schedule the first frame.
	requestAnimationFrame(update);
});


////////////////////////////////////////////////////
//anim
////////////////////////////////////////////////////
var aSin=0;
var bSin=0;
var cSin=0;
function update () {
  // Draw!
  for(var i=0; i<threejsInstance.length; i++){
  	 threejsInstance[i].renderer.render(threejsInstance[i].scene, threejsInstance[i].camera);

  }
 // headerInstance.renderer.render(headerInstance.scene, headerInstance.camera);
  var scaler=.01;
  for(var s=0; s<spheres.length; s++){
	spheres[s].rotation.x += spheres[s].rSpeed.x * scaler;
	spheres[s].rotation.y += spheres[s].rSpeed.y * scaler;
	spheres[s].rotation.z += spheres[s].rSpeed.z * scaler;

  }
	testsphere.rotation.x += 2 * scaler;
	testsphere.rotation.y += 1 * scaler;

	testsphereB.rotation.x += 1 * scaler;
	testsphereB.rotation.y += 3 * scaler;
	testsphereB.rotation.z += 1 * scaler;

	testCubeA.rotation.x += 1 * scaler;
	testCubeA.rotation.y += 1 * scaler;
	testCubeA.rotation.z += .5 * scaler;

	aSin += .005;
	bSin += .01;
	cSin += .008;
	//mess with sketching text
	if(mesh_sketching){
		// mesh_sketching.rotation.x += 1 * scaler;
		mesh_sketching.rotation.x -= Math.cos(aSin) * .003;
		mesh_sketching.rotation.y += Math.sin(aSin) * .001;
		// mesh_sketching.rotation.z += .5 * scaler;
		// mesh_in.rotation.y += 1 * scaler;
		// mesh_hardware.rotation.y += 1 * scaler;
		mesh_in.rotation.x += Math.cos(bSin) * .001;
		mesh_in.rotation.y -= Math.sin(bSin) * .001;
		mesh_hardware.rotation.x += Math.cos(cSin) * .001;
		mesh_hardware.rotation.y += Math.sin(cSin) * .002;
		
	}
	
	// testsphere.geometry.normalsNeedUpdate = true;
  // Schedule the next frame.
  requestAnimationFrame(update);
}


////////////////////////////////////////////////////
//util
////////////////////////////////////////////////////

function randRange(_min, _max){
	return _min + (Math.random()*Math.abs(_max-_min));
}



