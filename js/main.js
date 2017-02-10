console.log("el");


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
scene.add(pointLight);


////////////////////////////////////////////////////
//objects
////////////////////////////////////////////////////
var spheres=[];
for(var i=0; i<80; i++){
	var s = addSphere(randRange(10, 40), .5);

	s.position.x = randRange(-200, 200);
	s.position.y = randRange(-80, 100);
	s.position.z = randRange(-400, -500);

	s.rSpeed = new THREE.Vector3(randRange(-1,1), randRange(-1,1), randRange(-1,1));
	spheres.push(s);
}

function randRange(_min, _max){
	return _min + (Math.random()*Math.abs(_max-_min));
}

function addSphere(_radius, _vertDistort){
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
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
	    {
	      color: 0xeeff16,
	      shading: THREE.FlatShading
	    });

	var sphere = new THREE.Mesh(

	  new THREE.SphereGeometry(
	    RADIUS,
	    SEGMENTS,
	    RINGS),

	  sphereMaterial);

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
	scene.add(sphere);
	return sphere;
}

function update () {
  // Draw!
  renderer.render(scene, camera);
  var scaler=.01;
  for(var s=0; s<spheres.length; s++){
	spheres[s].rotation.x += spheres[s].rSpeed.x * scaler;
	spheres[s].rotation.y += spheres[s].rSpeed.y * scaler;
	spheres[s].rotation.z += spheres[s].rSpeed.z * scaler;

  }
  // Schedule the next frame.
  requestAnimationFrame(update);
}

// Schedule the first frame.
requestAnimationFrame(update);