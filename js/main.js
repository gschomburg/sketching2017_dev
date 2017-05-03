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
var organicParts=[];
var machineParts=[];

var connectors = [];
var machineblocks = [];

var dupcount = 5;

var treeCount = 20;
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

    //return an object of references
    return {
        container: container,
        scene: scene,
        camera: camera,
        renderer: renderer
    };
}

// var charretteInstance = createThreejsInstance('#charrette-graphic', 400, 400);
// var archiveInstance = createThreejsInstance('#archive-graphics', 900, 400);
// threejsInstance.push(charretteInstance);
// threejsInstance.push(archiveInstance);

////////////////////////////////////////////////////
//header
////////////////////////////////////////////////////
var mesh_sketchingtext;
var mesh_sketching;
var mesh_in;
var mesh_hardware;

var headerRoots =[];

var headerInstance;
function initHeader() {
    headerInstance = createThreejsInstance('#header-graphic', 1100, 700);
    threejsInstance.push(headerInstance);
    for(var t=0; t<treeCount; t++){
        var tree = buildTree(treeComplexity, .7, 1);

        //position
        tree.position.x = randRange(-10, 10);
        tree.position.y = randRange(-5, 10);
        tree.position.z = randRange(-35, -20);
        tree.rSpd = randRange(.1, .3);

        headerRoots.push(tree);
        headerInstance.scene.add(tree);
    }

    //load in sketching text
    var loader = new THREE.OBJLoader();
	loader.load(
		assetsPath + 'sk2017_lockup_v2.obj',
		function ( object ) {
			headerInstance.scene.add( object );
			mesh_sketchingtext = object;
			mesh_sketchingtext.position.x = -0;
			mesh_sketchingtext.position.y = 0;
			mesh_sketchingtext.position.z = -15;
			mesh_sketchingtext.scale.set(5,5,5);
			mesh_sketchingtext.traverse( function ( child ) {

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
            //once the lockup is loaded call reszie
            resizeHeader();
			});
		}
        
	);
   
}

var charretteTreeTop;
var charretteTreeBottom;
var charretteInstance;

function initCharrette() {
    charretteInstance = createThreejsInstance('#charrette-graphic', 400, 400);
    threejsInstance.push(charretteInstance);

    charretteTreeTop = buildTree(10, .05, 1);
    charretteTreeTop.position.z = -15;
    charretteTreeTop.rSpd = .2;
    // headerRoots.push(charretteTreeTop);
    charretteInstance.scene.add(charretteTreeTop);

    charretteTreeBottom = buildTree(10, .95, 1);
    charretteTreeBottom.position.z = -15;
    charretteTreeBottom.rotation.x = Math.PI;
    charretteTreeBottom.rSpd = .2;
    // headerRoots.push(charretteTreeBottom);
    charretteInstance.scene.add(charretteTreeBottom);

    resizeCharrette();

    $( charretteInstance.container).mousemove(charretteMouse);
    $( charretteInstance.container).mouseleave(function(){
        charretteInstance.isOver=false;
    });
}

var cTopSpdY = 0; //new THREE.Euler(0, 0, 0);
var cBottomSpdY = 0//new THREE.Euler(Math.PI, 0, 0);
function charretteMouse(event){
    charretteInstance.isOver=true;
    var x = event.offsetX / $(charretteInstance.container).width();
    var y = event.offsetY / $(charretteInstance.container).height();

    var msg = "Handler for .mousemove() called at ";
    msg += x + ", " + y;
    console.log(msg);

    cTopSpdY = (x*2)-1; //new THREE.Euler(0, Math.PI*2*x, 0);
    cBottomSpdY = (y*2)-1; //new THREE.Euler(Math.PI, , 0);
}

var archiveInstance;
var archiveObj=[]; //multi dimensional array

function initArchive(){
    archiveInstance = createThreejsInstance('#archive-graphics', 900, 400);
    threejsInstance.push(archiveInstance);
    //build out a grid of the parts
    //8x4
    var cols=6;
    var rows=3;
    var xSpace=4.5;
    var ySpace=3.5;
    var offsetX = (cols/2 * -xSpace) + (xSpace*.5);
    var offsetY = (rows/2 * ySpace) + (-ySpace*.9);
    var p=0;
    for(var r=0; r<rows; r++){
        var rowObjs = [];
        for(var c=0; c<cols; c++){
            var obj;
            if(Math.random()<.8){
                obj = getRandomItem(machineParts).clone();
            }else{
                obj = getRandomItem(organicParts).clone();
            }
            // var obj = parts[p].clone();
            // p++;
            archiveInstance.scene.add(obj);
            obj.position.x = offsetX + (c*xSpace);
            obj.position.y = offsetY - (r*ySpace);
            obj.position.z = -15;
            var s = .8;
            obj.scale.set(s,s,s);

            obj.rSpd = randRange(.1, .3);
            // headerRoots.push(obj);
            rowObjs.push(obj);
        }
        archiveObj.push(rowObjs);
    }
    resizeArchive();
    $( archiveInstance.container).mousemove(archiveMouse);
    $( archiveInstance.container).mouseleave(function(){
        archiveInstance.isOver=false;
        aMouseX = -1;
        aMouseY = -1;
    });
}
var aMouseX = -1; //new THREE.Euler(0, 0, 0);
var aMouseY = -1//new THREE.Euler(Math.PI, 0, 0);
function archiveMouse(event){
    archiveInstance.isOver=true;
    aMouseX = event.offsetX / $(archiveInstance.container).width();
    aMouseY = event.offsetY / $(archiveInstance.container).height();

    // var msg = "archive for .mousemove() called at ";
    // msg += aMouseX + ", " + aMouseY;
    // console.log(msg);
}

function buildTree(branchCount, machineWeight, maxBranchLevel){
    // var partIndex = Math.floor(randRange(0, machineParts.length));
    availableBranches = [];

    var rootObj;
    if(Math.random<machineWeight){
        rootObj = getRandomItem(machineParts).clone();
    }else{
        rootObj = getRandomItem(organicParts).clone();
    }

    saveBranchPoints(rootObj, 0);

    for (var c = 0; c < branchCount; c++) {
            

            var branch = getAvailableBranch();
            if(branch==null){
                // console.log('exiting no branches');
                break;
            }
            var obj;
            //get a part based on machine weight
            if(Math.random()<machineWeight){
                obj = getRandomItem(machineParts).clone();
            }else{
                obj = getRandomItem(organicParts).clone();
            }

            //if we're not at the max branch level find valid branches
            if(branch.branchLevel<maxBranchLevel){
                saveBranchPoints(obj, branch.branchLevel+1);
            }else{

              // console.log(branch.branchLevel + ' :branchmax level');
            }

            //position the part
            var targetPosition = branch.geometry.boundingBox.getCenter();
            obj.position.x = targetPosition.x;
            obj.position.y = targetPosition.y;
            obj.position.z = targetPosition.z;

            //rotate the part
            var upVector = new THREE.Vector3(0, 1, 0);
            var normalsArray = branch.geometry.getAttribute('normal');
            var branchNormal = new THREE.Vector3(normalsArray.array[0], normalsArray.array[1], normalsArray.array[2]);

            var angle = upVector.angleTo(branchNormal);
            var axis = new THREE.Vector3().crossVectors(upVector, branchNormal); //get the axis
            axis.normalize();

            obj.rotateOnAxis(branchNormal, Math.random() * Math.PI);
            obj.rotateOnAxis(axis, angle);
            
            //scale the part
            // var s = randRange(.8, 1.1);
            // obj.scale.set(s,s,s);

            branch.add(obj);
        }
    return rootObj;
}
function saveBranchPoints(obj, level){
    obj.traverse(function(child) {
        if (child.name.indexOf('branch') > -1) {
            child.geometry.computeBoundingBox();
            child.branchLevel = level;
            availableBranches.push(child);
        }
    });
}
function addBranch(){

}

function getAvailableBranch() {
    // sample array at random
    var index = Math.floor(randRange(0, availableBranches.length));
    var branch = availableBranches[index];
    availableBranches.splice(index, 1);
    return branch;
}

function loadParts() {
    for (var i = 0; i < partNames.length; i++) {
        loadPart('parts/' + partNames[i]);
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
            partLoaded(object, _name);
        }
    );
}

function partLoaded(object, name) {
    //organize the parts
    if(name.indexOf('organic')>-1){
        organicParts.push(object);
    }
    if(name.indexOf('machine')>-1){
        machineParts.push(object);
    }
    parts.push(object);
    if (parts.length == partNames.length) {
        console.log('parts finished loaded');
        //init all the threejs instances
        initHeader();
        initCharrette();
        initArchive();
    } else {
        // console.log(name + 'still loading');
    }
}

////////////////////////////////////////////////////
//resize ing
////////////////////////////////////////////////////
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    resizeHeader();
    resizeCharrette();
    // for (var i = 0; i < threejsInstance.length; i++) {
    //     threejsInstance[i].renderer.render(threejsInstance[i].scene, threejsInstance[i].camera);

    // }
    resizeArchive();
}

var headerMinHeight = 250;
var headerMaxHeight = 600;
var headerMinWidth = 450;

function resizeHeader(){
    // var contentWidth = $('#body-content').width();
    var cWidth = clamp($('#body-content').width(), headerMinWidth, 2000);
    var ratio =2.5/4.5;
    var cHeight = clamp(cWidth*(ratio), headerMinHeight, headerMaxHeight);

    //set the height of the container so the canvas hangs down
    $('#header-graphic').height(cHeight*.85);

    //position text
    mesh_sketchingtext.position.x = -2.5;
    mesh_sketchingtext.position.y = 1.5;
    // mesh_sketchingtext.position.z = -15;
    mesh_sketchingtext.scale.set(7,7,7);

    headerInstance.camera.aspect = cWidth / cHeight;
    headerInstance.camera.updateProjectionMatrix();

    headerInstance.renderer.setSize( cWidth, cHeight );
}
function colSize(){
    var w = $('.col-full').width();
    if(w<480){return w*.8}
    return Math.floor(w*.3333);
}
function resizeCharrette(){
    var width=colSize();
    charretteInstance.camera.aspect = width / width;
    charretteInstance.camera.updateProjectionMatrix();

    charretteInstance.renderer.setSize( width, width );
}
function resizeArchive(){
    var ratio =4/9;
    // var contentWidth = $('#body-content').width();
    var cWidth = Math.floor(clamp($('#body-content').width(), headerMinWidth, 900));
    archiveInstance.camera.aspect = cWidth / (cWidth * ratio);
    archiveInstance.camera.updateProjectionMatrix();

    archiveInstance.renderer.setSize( cWidth, (cWidth * ratio) );
    // var cHeight = 400;
    // archiveInstance.camera.aspect = window.innerWidth / cHeight;
    // archiveInstance.camera.updateProjectionMatrix();

    // archiveInstance.renderer.setSize( window.innerWidth, cHeight );
}

////////////////////////////////////////////////////
//anim
////////////////////////////////////////////////////

function update() {


    // headerInstance.renderer.render(headerInstance.scene, headerInstance.camera);
    var rotationSpeedScaler = .005;

    for (var p = 0; p < headerRoots.length; p++) {
        headerRoots[p].rotateY(headerRoots[p].rSpd * rotationSpeedScaler);
    }

    if(charretteTreeTop !=null){
        charretteTreeTop.rotateY(cTopSpdY *.05);
        charretteTreeBottom.rotateY(cBottomSpdY*.05);

        if(charretteInstance.isOver!=true){
            cTopSpdY *= .95;
            cBottomSpdY *=.95
        }
    }
    if(archiveInstance !=null){
        //set rotation speeds for grids
        var cols=6;
        var rows=3;
        //pick a column and row
        var activeCol = Math.floor(aMouseX*cols);
        var activeRow = Math.floor(aMouseY*rows);
        // archiveObj[activeCol][activeRow].rotateY(.05);
        // console.log(c +"," +r);
        for(var r=0; r<rows; r++){
            for(var c=0; c<cols; c++){
                var spd = .008;
                if(r==activeRow && c == activeCol){
                    spd = .06;
                }
                archiveObj[r][c].rotateY(spd);
            }
        }
    }

    // loop through instances
    for (var i = 0; i < threejsInstance.length; i++) {
        
        if( onScreen(threejsInstance[i].container) ){
           threejsInstance[i].renderer.render(threejsInstance[i].scene, threejsInstance[i].camera);
            // $(threejsInstance[i].container).css('border', '1px solid blue');
        }
    }
    requestAnimationFrame(update);
}

function onScreen(_container){
    var maxScroll = (window.getWinSize()[1]*0.8) + scrollTop();
    var minScroll = scrollTop(); //minScroll + $(_container).height();
    if($(_container).offset().top<maxScroll && $(_container).offset().top + $(_container).height()>minScroll){
         // console.log(_container, minScroll, minScroll);
        return true;
    }
    return false;
}

////////////////////////////////
//UTILS for dealing with IE windows
function scrollTop(){
    var top = (document.documentElement && document.documentElement.scrollTop) || 
              document.body.scrollTop;
    return top;
}
window.getWinSize = function(){
    if(window.innerWidth!= undefined){
        return [window.innerWidth, window.innerHeight];
    }
    else{
        var B= document.body, 
        D= document.documentElement;
        return [Math.max(D.clientWidth, B.clientWidth),
        Math.max(D.clientHeight, B.clientHeight)];
    }
}


/*
var helper = new THREE.BoundingBoxHelper(someObject3D, 0xff0000);
helper.update();
// If you want a visible bounding box
scene.add(helper);
// If you just want the numbers
console.log(helper.box.min);
console.log(helper.box.max);
*/


////////////////////////////////////////////////////
//util
////////////////////////////////////////////////////

function randRange(_min, _max) {
    return _min + (Math.random() * Math.abs(_max - _min));
}

function getRandomItem(_array){
    var partIndex = Math.floor(randRange(0, _array.length));
    return _array[partIndex];
}
function clamp(val, min, max){
    if(val<min){
        val = min;
    }
    if(val>max){
        val = max;
    }
    return val;
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

$(document).ready(function() {
    loadParts();
    // Schedule the first frame.
    requestAnimationFrame(update);
});