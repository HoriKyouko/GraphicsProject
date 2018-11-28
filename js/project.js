var scene;
var camera;
var renderer;
var controls; // OrbitControls
var reflectionCube, cubeShader, cubeMaterial; // Used in our cubeMap
var params = {
    envMap: "Dawn"
}; // holds a variable we change around in dat.gui
var dawnRenderTarget, sunriseRenderTarget, morningRenderTarget, noonRenderTarget, afternoonRenderTarget, eveningRenderTarget, sunsetTarget, duskRenderTarget; // all our individual render targets probably going to make this into some object for condensing purposes.

let lambo ={
    //mtlPathName:"objects/",
    objPathName: "objects/",
    //texturePathName: "objects/",
    //mtlFileName: "Lamborghini_Aventador.mtl",
    objFileName: "Lamborghini_Aventador.obj",
    scale: 40,
    y_rotate: 0,
    translateVector: new THREE.Vector3(0,0,0),
    obj: undefined,
    name: "lambo"
};

// Function to be called when we first load the file see bottom of code.
function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
    setupCamera(); // sets our camera up.
    setupRenderer(); // creates our renderer
    setupControls(); // gets our orbit control ready
    setupCubeMap("images/test/", ".png"); // creates our cubemap with the first image which is dawn
    preloadTextures(); // loads in all the other textures into our above renderTargets respectively.
    //addCircle(); // creates a semi-opaque blue sphere inside the cube.
    setupLight(); // creates some ambient lighting.
    window.addEventListener("resize", onWindowResize, false); // allows resizing if we open developer tools.
    var gui = new dat.GUI(); // creates our gui and puts in 8 options at the moment.
    gui.add(params, "envMap", ["Dawn", "Sunrise", "Morning", "Noon", "Afternoon", "Evening", "Sunset", "Dusk"]);
    gui.open();
    addObjToSceneAndRender(lambo, scene, renderer);
    animate(); // finally renders.
}
// Loads in our textures by calling updateTexture.
function preloadTextures(){
    for(var i = 1; i <= 8; i++){
        switch(i){
            case 1: updateTexture("images/Dawn/", ".png", "Dawn"); break;
            case 2: updateTexture("images/Sunrise/", ".png", "Sunrise"); break;
            case 3: updateTexture("images/Morning/", ".png", "Morning"); break;
            case 4: updateTexture("images/Noon/", ".png", "Noon"); break;
            case 5: updateTexture("images/Afternoon/", ".png", "Afternoon"); break;
            case 6: updateTexture("images/Evening/", ".png", "Evening"); break;
            case 7: updateTexture("images/Sunset/", ".png", "Sunset"); break;
            case 8: updateTexture("images/Dusk/", ".png", "Dusk"); break;
        }
    }
}
// Sets our camera at a location and looks at 0,0,0.
function setupCamera(){
    camera.position.z = 2000;
    camera.lookAt(scene.position);
}
// Sets our renderer to be WebGL and sets the sizes to the screen size.
function setupRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}
// Sets our orbit controls up.
function setupControls(){
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 15;
    controls.maxDistance = 35;
}
// Sets our cubemap and cube we will be using up and calls our shaderMaterial. The later might be moved as we build on this.
function setupCubeMap(path, format){
    var cubeGeo = new THREE.BoxGeometry(1024,1024,1024);
    cubeShader = THREE.ShaderLib["cube"];
    cubeMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });
    updateTexture(path, format);
    reflectionCube.format = THREE.RGBFormat;
    
    var cube = new THREE.Mesh(cubeGeo, cubeMaterial);
    scene.add(cube);
}
// Gets our texture we want to load in as a array and alls loadTexture.
function updateTexture(path, format, target){
    var urls = [
        path +"px"+format, path+"nx"+format,
        path +"py"+format, path+"ny"+format,
        path +"pz"+format, path+"nz"+format
    ];
    loadTexture(urls, target);
}
// Loads our texture in using CubeTextureLoader and stores the values into reflectionCube. Also depending on the target we will pass refelection cube values to the respective renderTarget.
function loadTexture(texture, target){
    if(reflectionCube)
        reflectionCube.dispose();
    loader = new THREE.CubeTextureLoader();
    loader.setCrossOrigin("anonymous");
    reflectionCube = loader.load(texture);
    switch(target){
        case "Dawn": dawnRenderTarget = reflectionCube; break;
        case "Sunrise": sunriseRenderTarget = reflectionCube; break;
        case "Morning": morningRenderTarget = reflectionCube; break;
        case "Noon": noonRenderTarget = reflectionCube; break;
        case "Afternoon": afternoonRenderTarget = reflectionCube; break;
        case "Evening": eveningRenderTarget = reflectionCube; break;
        case "Sunset": sunsetTarget = reflectionCube; break;
        case "Dusk": duskRenderTarget = reflectionCube; break;
    }
    cubeMaterial.uniforms.tCube.value = reflectionCube;
}
// Adds our semi-opaque blue sphere to the scene.
function addCircle(){
    var geometry = new THREE.SphereGeometry(8, 32, 32);
    var material = new THREE.MeshLambertMaterial({color: 0x2194ce, transparent: true, opacity: 0.5});
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
}
// Adds our white ambient light to the scene.
function setupLight(){
    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );
}
// Resizes the camera everytime we change the viewing size.
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function addObjToSceneAndRender(objectInfo, scene, render) {

	if (!objectInfo.objFileName) {
		console.log("Missing Object file");
	}
	let objLoader = new THREE.OBJLoader();
	if (objectInfo.objPathName) objLoader.setPath(objectInfo.objPathName);
	if (objectInfo.mtlPathName) 
	{
		let mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath(objectInfo.mtlPathName);
		if (objectInfo.texturePathName) 	
			mtlLoader.setTexturePath(objectInfo.texturePathName);
		mtlLoader.load(objectInfo.mtlFileName, onMtlLoad);
	}
	else objLoader.load(objectInfo.objFileName, onObjLoad);
		
	function onMtlLoad(mtl) {
	  mtl.preload();
	  objLoader.setMaterials(mtl);
	  objLoader.load(objectInfo.objFileName, onObjLoad);
	}

	// called when resource is loaded
	function onObjLoad(object) {
        //object.children.forEach(function(e){e.material = normalMaterial;});
        let bBox = new THREE.Box3().setFromObject(object);
        let size = new THREE.Vector3();
        bBox.getSize(size);
        let maxBaseSize = Math.max(size.x, size.z);
        let scaleFactor = ((objectInfo.scale)?objectInfo.scale:1)/ maxBaseSize;
        object.scale.multiplyScalar(scaleFactor);
        if (objectInfo.y_rotate) object.rotateY(objectInfo.y_rotate);
        if (objectInfo.translateVector) object.position.copy(objectInfo.translateVector);
        objectInfo.obj = object;
        objectInfo.obj.children.length = 6;
        for(var i = 0; i < 6; i++){
            objectInfo.obj.children[i].material = new THREE.MeshPhongMaterial( { color: 0xffffff, shininess: 100, envMap: reflectionCube} );
        }
        scene.add(object);
        animate();
	}
}

function updateObjectMaterial(object, material){
	if (object.material) object.material = material;
	else if (object.children)
		object.children.forEach(function(e){e.material = material;});
	else alert("Error: Object does not have material property.");
}

// Renders everything on screen and checks to see if we have changed our envMap in params to a different renderTarget.
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    var newCubeMaterial = cubeMaterial.uniforms.tCube.value;
    switch(params.envMap){
        case "Dawn":  newCubeMaterial = dawnRenderTarget ? dawnRenderTarget : null; break;
        case "Sunrise": newCubeMaterial = sunriseRenderTarget ? sunriseRenderTarget : null; break;
        case "Morning":  newCubeMaterial = morningRenderTarget ? morningRenderTarget : null; break;
        case "Noon": newCubeMaterial = noonRenderTarget ? noonRenderTarget : null; break;
        case "Afternoon":  newCubeMaterial = afternoonRenderTarget ? afternoonRenderTarget : null; break;
        case "Evening": newCubeMaterial = eveningRenderTarget ? eveningRenderTarget : null; break;
        case "Sunset":  newCubeMaterial = sunsetTarget ? sunsetTarget : null; break;
        case "Dusk": newCubeMaterial = duskRenderTarget ? duskRenderTarget : null; break;
    }
    // Checks to see if they are the same cause we don't want to change that if it is.
    if(newCubeMaterial !== cubeMaterial.uniforms.tCube.value){
        cubeMaterial.uniforms.tCube.value = newCubeMaterial;
    }
    
    renderer.render(scene, camera);
}

window.onload = init();
