console.log("el");

//break out three js creation into seperate tab
//add shader
//

var threejsInstance = [];
var assetsPath = "assets/";
var parts = [];
var partNames =
    [
        "organic_001.obj",
        "organic_002.obj",
        "organic_003.obj",
        "organic_004.obj",
        "organic_005.obj",
        "organic_006.obj",
        "organic_007.obj",
        "organic_008.obj",
        "organic_009.obj",
        "organic_010.obj",
        // "nasa_test001.obj",
        "machine_001.obj",
        "machine_002.obj",
        "machine_003.obj",
        "machine_004.obj",
        "machine_005.obj",
        "machine_006.obj",
        "machine_007.obj",
        "machine_008.obj",
        "machine_009.obj",
        "machine_010.obj",
    ];

var connectors = [];
var machineblocks = [];

var dupcount = 5;

var treeCount = 30;
var treeComplexity = 10;

var headerParts = [];
var availableBranches = [];



function createThreejsInstance(_container, _width, _height) {
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
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
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

    return {
        container: container,
        scene: scene,
        camera: camera,
        renderer: renderer
    };
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
// const pointLight =
//     new THREE.PointLight(0xFFFFFF);

// // set its position
// pointLight.position.x = -200;
// pointLight.position.y = 150;
// pointLight.position.z = 130;

// // add to the scene
// headerInstance.scene.add(pointLight);

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
// var spheres = [];

var mesh_sketching;
var mesh_in;
var mesh_hardware;

function initHeader() {
    //root part
    for (var i = 0; i < treeCount; i++) {
    	// crete the root part
        var partIndex = Math.floor(randRange(0, parts.length));
        var rootObj = parts[partIndex].clone();
        
        rootObj.rSpd = randRange(.3, .5);
        headerParts.push(rootObj);
        headerInstance.scene.add(rootObj);
        
        // find the available branches (mount points)
        availableBranches = [];
        rootObj.traverse(function(child) {
            if (child.name.indexOf('branch') > -1) {
                // mesh_sketching = child;
                child.geometry.computeBoundingBox();
                availableBranches.push(child);
            }
        });

        // transform the root

        rootObj.position.x = randRange(-10, 10);
        rootObj.position.y = randRange(-5, 12);
        rootObj.position.z = randRange(-35, -20);

        rootObj.rotation.x = randRange(0, Math.PI);
        rootObj.rotation.y = randRange(0, Math.PI);
        rootObj.rotation.z = randRange(0, Math.PI);

        var s = randRange(.5, 1);
        rootObj.scale.set(s,s,s);



        //*
        // for(var i=0;  i<parts.length; i++){
        for (var c = 0; c < treeComplexity; c++) {
            var partIndex = Math.floor(randRange(0, parts.length));
            var obj = parts[partIndex].clone();

            var branch = getAvailableBranch();

            branch.add(obj);

            var s = randRange(.8, 1.1);
            obj.scale.set(s,s,s);

            var upVector = new THREE.Vector3(0, 1, 0);
            var normalsArray = branch.geometry.getAttribute('normal');
            var branchNormal = new THREE.Vector3(normalsArray.array[0], normalsArray.array[1], normalsArray.array[2]);


            var angle = upVector.angleTo(branchNormal);
            var axis = new THREE.Vector3().crossVectors(upVector, branchNormal); //get the axis
 			axis.normalize();

            var targetPosition = branch.geometry.boundingBox.getCenter();
            // var targetPosition = branch.geometry.boundingBox.getCenter();
            obj.position.x = targetPosition.x;
            obj.position.y = targetPosition.y;
            obj.position.z = targetPosition.z;

            obj.rotateOnAxis(branchNormal, Math.random() * Math.PI);
            obj.rotateOnAxis(axis, angle);
            
            //find the available branches
            obj.traverse(function(child) {
                if (child.name.indexOf('branch') > -1) {
                    child.geometry.computeBoundingBox();
                    availableBranches.push(child);
                }
            });
        }
    }
    //load in sketching text
    var loader = new THREE.OBJLoader();

    // load resource

	loader.load(
		assetsPath + 'sk2017_lockup_v2.obj',
		function ( object ) {
			headerInstance.scene.add( object );
			
			object.position.x = -0;
			object.position.y = 0;
			object.position.z = -15;
			object.scale.set(5,5,5);
			object.traverse( function ( child ) {

        		if ( child instanceof THREE.Mesh ) {
                    //identify meshes for later maybe
					child.material = shaderMaterialLogotype;
					if(child.name.indexOf('Sketching_Mesh')>-1){
						mesh_sketching = child;
					}
					if(child.name.indexOf('in_Mesh')>-1){
						mesh_in = child;
					}
					if(child.name.indexOf('Hardware_Mesh')>-1){
						mesh_hardware = child;
					}
				}

			});
		}
		
	);

}

function getAvailableBranch() {
    // sample array at random
    var index = Math.floor(randRange(0, availableBranches.length));
    var branch = availableBranches[index];
    availableBranches.splice(index, 1);
    return branch;
}

function partLoaded(object) {
    parts.push(object);
    if (parts.length == partNames.length) {
        console.log('parts finished loaded');
        initHeader();
        initCharrette();
    } else {
        console.log('still loading');
    }
}

function loadPart(_name) {
    var partLoader = new THREE.OBJLoader();

    // load a resource
    partLoader.load(
        // resource URL
        assetsPath + _name,
        function(object) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = shaderMaterial;
                }
            });
            partLoaded(object);
        }
    );
}

function loadParts() {
    for (var i = 0; i < partNames.length; i++) {
        loadPart('parts/' + partNames[i]);
    }
}


function initCharrette() {
    //build a tree in the charrette

    testCubeA = new THREE.Mesh(

        new THREE.BoxGeometry(
            90, 90, 90),

        shaderMaterial);
    charretteInstance.scene.add(testCubeA);
    testCubeA.position.z = -400;
}

function initFooter(){
    //build out a grid of the parts
}

var testCubeA;

$(document).ready(function() {
    loadParts();
    // Schedule the first frame.
    requestAnimationFrame(update);
});


////////////////////////////////////////////////////
//anim
////////////////////////////////////////////////////

function update() {
    // loop through instances
    for (var i = 0; i < threejsInstance.length; i++) {
        threejsInstance[i].renderer.render(threejsInstance[i].scene, threejsInstance[i].camera);

    }

    // headerInstance.renderer.render(headerInstance.scene, headerInstance.camera);
    var rotationSpeedScaler = .005;

    for (var p = 0; p < headerParts.length; p++) {
        headerParts[p].rotateY(headerParts[p].rSpd * rotationSpeedScaler);
        // headerParts[p].rotateOnAxis ( headerParts[p].rotationAxis, headerParts[p].rSpd * rotationSpeedScaler );
        // headerParts[p].rotation.x += headerParts[p].rSpd * rotationSpeedScaler;
        // headerParts[p].rotation.y += headerParts[p].rSpd * rotationSpeedScaler;
        // headerParts[p].rotation.z += headerParts[p].rSpd * rotationSpeedScaler;

    }

    if(testCubeA!=null){
        testCubeA.rotation.x += 1 * rotationSpeedScaler;
        testCubeA.rotation.y += 1 * rotationSpeedScaler;
        testCubeA.rotation.z += .5 * rotationSpeedScaler;
    }
    requestAnimationFrame(update);
}


////////////////////////////////////////////////////
//util
////////////////////////////////////////////////////

function randRange(_min, _max) {
    return _min + (Math.random() * Math.abs(_max - _min));
}

///////////////////////////////////
//shader materials
///////////////////////////////////

var colorMapLoader = new THREE.TextureLoader();

//shader
var vShader = $('#vertexshader');
var fShader = $('#fragmentshader');

var uniforms = {};

var uniforms = {
    texture1: {
        type: "t",
        value: colorMapLoader.load(assetsPath + 'color_v4.jpg', function(texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
        })
    },
    vOffset: 0
};
var uniformsLogotype = {
    texture1: {
        type: "t",
        value: colorMapLoader.load(assetsPath + 'color_v3_logotype.jpg', function(texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
        })
    },
    vOffset: 0
};


var shaderMaterial =
new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vShader.text(),
    fragmentShader: fShader.text()
});

var shaderMaterialLogotype =
new THREE.ShaderMaterial({
    uniforms: uniformsLogotype,
    vertexShader: vShader.text(),
    fragmentShader: fShader.text()
});