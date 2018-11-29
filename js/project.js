var scene;
var camera;
var renderer;
var dirLight, ambient, pointLight;
var controls; // OrbitControls
var reflectionCube, cubeShader, cubeMaterial, newCubeMaterial; // Used in our cubeMap
var params = {
    envMap: "Dawn",
    Light: "No Ambient"
}; // holds a variable we change around in dat.gui
var dawnRenderTarget, sunriseRenderTarget, morningRenderTarget, noonRenderTarget, afternoonRenderTarget, eveningRenderTarget, sunsetTarget, duskRenderTarget; // all our individual render targets probably going to make this into some object for condensing purposes.
var dawnMaterial, sunriseMaterial, morningMaterial, noonMaterial, afternoonMaterial, eveningMaterial, sunsetMaterial, duskMaterial, myMaterial;

let sphereGeometry, sphereMaterial, sph, sphereUp, sphereMaxHeight, sphereMinHeight, sphereChange;

let lambo ={
    objPathName: "objects/",
    objFileName: "Lamborghini_Aventador.obj",
    scale: 1000,
    y_rotate: 0,
    translateVector: new THREE.Vector3(0,-1024,-512),
    obj: undefined,
    name: "lambo"
};

let mercedes ={
    objPathName: "objects/",
    objFileName: "class2010.obj",
    scale: 600,
    y_rotate: 0,
    translateVector: new THREE.Vector3(0,-512,-1024),
    obj: undefined,
    name: "mercedes"
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
    addCircle(sph, sphereGeometry, sphereMaterial); // creates a semi-opaque blue sphere inside the cube.
    setupLight(); // creates some ambient lighting.
    window.addEventListener("resize", onWindowResize, false); // allows resizing if we open developer tools.
    var gui = new dat.GUI(); // creates our gui and puts in 8 options at the moment.
    gui.add(params, "envMap", ["Dawn", "Sunrise", "Morning", "Noon", "Afternoon", "Evening", "Sunset", "Dusk"]);
    gui.add(params, "Light", ["Ambient", "No Ambient"]);
    gui.open();
    addObjToSceneAndRender(lambo, scene, renderer);
    addObjToSceneAndRender(mercedes, scene, renderer);
    sph = scene.children[1];
    sphereUp = true;
    sphereMaxHeight = 512;
    sphereMinHeight = -512;
    sphereChange = 1;
    animate(); // finally renders.
}
// Loads in our textures by calling updateTexture.
function preloadTextures(){
    let data;
    let dataTexture;
    let lightMap;
    for(var i = 1; i <= 8; i++){
        switch(i){
            case 1:
                lightMap = readFromFile("images/Dawn/dawn.out");
                lightMap = lightMap.split(", ");
                data = Uint8Array.from(lightMap);
                dataTexture = new THREE.DataTexture(data, 72, 36, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping);
                dataTexture.needsUpdate = true;
                dawnMaterial = new THREE.RawShaderMaterial({
                    side: THREE.DoubleSide,
                    uniforms:{
                        diffuseColor: {value: new THREE.Color(0xffffff)},
                        texture: {value: dataTexture}
                    },
                    fragmentShader: readFromFile("Assignment5-18.fs"),
                    vertexShader: readFromFile("Assignment5.vs")
                });
                updateTexture("images/Dawn/", ".png", "Dawn"); break;
            case 2:
                lightMap = readFromFile("images/Sunrise/sunrise.out");
                lightMap = lightMap.split(", ");
                data = Uint8Array.from(lightMap);
                dataTexture = new THREE.DataTexture(data, 72, 36, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping);
                dataTexture.needsUpdate = true;
                sunriseMaterial = new THREE.RawShaderMaterial({
                    side: THREE.DoubleSide,
                    uniforms:{
                        diffuseColor: {value: new THREE.Color(0xffffff)},
                        texture: {value: dataTexture}
                    },
                    fragmentShader: readFromFile("Assignment5-18.fs"),
                    vertexShader: readFromFile("Assignment5.vs")
                });
                updateTexture("images/Sunrise/", ".png", "Sunrise"); break;
            case 3:
                lightMap = readFromFile("images/Morning/morning.out");
                lightMap = lightMap.split(", ");
                data = Uint8Array.from(lightMap);
                dataTexture = new THREE.DataTexture(data, 72, 36, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping);
                dataTexture.needsUpdate = true;
                morningMaterial = new THREE.RawShaderMaterial({
                    side: THREE.DoubleSide,
                    uniforms:{
                        diffuseColor: {value: new THREE.Color(0xffffff)},
                        texture: {value: dataTexture}
                    },
                    fragmentShader: readFromFile("Assignment5-18.fs"),
                    vertexShader: readFromFile("Assignment5.vs")
                });
                updateTexture("images/Morning/", ".png", "Morning"); break;
            case 4:
                lightMap = readFromFile("images/Noon/noon.out");
                lightMap = lightMap.split(", ");
                data = Uint8Array.from(lightMap);
                dataTexture = new THREE.DataTexture(data, 72, 36, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping);
                dataTexture.needsUpdate = true;
                noonMaterial = new THREE.RawShaderMaterial({
                    side: THREE.DoubleSide,
                    uniforms:{
                        diffuseColor: {value: new THREE.Color(0xffffff)},
                        texture: {value: dataTexture}
                    },
                    fragmentShader: readFromFile("Assignment5-18.fs"),
                    vertexShader: readFromFile("Assignment5.vs")
                });
                updateTexture("images/Noon/", ".png", "Noon"); break;
            case 5:
                lightMap = readFromFile("images/Afternoon/afternoon.out");
                lightMap = lightMap.split(", ");
                data = Uint8Array.from(lightMap);
                dataTexture = new THREE.DataTexture(data, 72, 36, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping);
                dataTexture.needsUpdate = true;
                afternoonMaterial = new THREE.RawShaderMaterial({
                    side: THREE.DoubleSide,
                    uniforms:{
                        diffuseColor: {value: new THREE.Color(0xffffff)},
                        texture: {value: dataTexture}
                    },
                    fragmentShader: readFromFile("Assignment5-18.fs"),
                    vertexShader: readFromFile("Assignment5.vs")
                });
                updateTexture("images/Afternoon/", ".png", "Afternoon"); break;
            case 6:
                lightMap = readFromFile("images/Evening/evening.out");
                lightMap = lightMap.split(", ");
                data = Uint8Array.from(lightMap);
                dataTexture = new THREE.DataTexture(data, 72, 36, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping);
                dataTexture.needsUpdate = true;
                eveningMaterial = new THREE.RawShaderMaterial({
                    side: THREE.DoubleSide,
                    uniforms:{
                        diffuseColor: {value: new THREE.Color(0xffffff)},
                        texture: {value: dataTexture}
                    },
                    fragmentShader: readFromFile("Assignment5-18.fs"),
                    vertexShader: readFromFile("Assignment5.vs")
                });
                updateTexture("images/Evening/", ".png", "Evening"); break;
            case 7:
                lightMap = readFromFile("images/Sunset/sunset.out");
                lightMap = lightMap.split(", ");
                data = Uint8Array.from(lightMap);
                dataTexture = new THREE.DataTexture(data, 72, 36, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping);
                dataTexture.needsUpdate = true;
                sunsetMaterial = new THREE.RawShaderMaterial({
                    side: THREE.DoubleSide,
                    uniforms:{
                        diffuseColor: {value: new THREE.Color(0xffffff)},
                        texture: {value: dataTexture}
                    },
                    fragmentShader: readFromFile("Assignment5-18.fs"),
                    vertexShader: readFromFile("Assignment5.vs")
                });
                updateTexture("images/Sunset/", ".png", "Sunset"); break;
            case 8:
                lightMap = readFromFile("images/Dusk/dusk.out");
                lightMap = lightMap.split(", ");
                data = Uint8Array.from(lightMap);
                dataTexture = new THREE.DataTexture(data, 72, 36, THREE.RGBFormat, THREE.UnsignedByteType, THREE.UVMapping);
                dataTexture.needsUpdate = true;
                duskMaterial = new THREE.RawShaderMaterial({
                    side: THREE.DoubleSide,
                    uniforms:{
                        diffuseColor: {value: new THREE.Color(0xffffff)},
                        texture: {value: dataTexture}
                    },
                    fragmentShader: readFromFile("Assignment5-18.fs"),
                    vertexShader: readFromFile("Assignment5.vs")
                });
                updateTexture("images/Dusk/", ".png", "Dusk"); break;
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
    var cubeGeo = new THREE.BoxGeometry(2048,2048,2048);
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
function addCircle(sph, sphereGeometry, sphereMaterial){
    sphereGeometry = new THREE.SphereGeometry(64, 512, 512);
    sphereMaterial = new THREE.MeshBasicMaterial();
    sph = new THREE.Mesh(sphereGeometry, sphereMaterial);
    /*var geometry = new THREE.SphereGeometry(8, 32, 32);
    var material = new THREE.MeshLambertMaterial({color: 0x2194ce, transparent: true, opacity: 0.5});
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(800, 0, -405);*/
    sph.position.set(512, 0, -512);
    sph.name = "SPHERE";
    scene.add(sph);
}
// Adds our white ambient light to the scene.
function setupLight(){
    ambient = new THREE.AmbientLight( 0xffffff );
    pointLight = new THREE.PointLight( 0xffffff);
    dirLight = new THREE.DirectionalLight(0x731899);
    pointLight.position.set(512, 0, -512);
    scene.add(pointLight);
    scene.add(dirLight);
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
        if(objectInfo.name === "mercedes"){
            for(var i = 0; i < 40; i++){
                objectInfo.obj.children[i].material = new THREE.MeshPhongMaterial({color: 0xffffff, shininess:100, envMap: newCubeMaterial});
            }
        }
        else{
            objectInfo.obj.children.length = 6;
            for(var i = 0; i < 6; i++){
                objectInfo.obj.children[i].material = myMaterial;
            }
        }
        sph.material = new THREE.MeshPhongMaterial({color: 0xffffff, shininess:100, envMap: newCubeMaterial});
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

function readFromFile(filename){
    // Create a http request
    var	xmlhttp = new XMLHttpRequest();
    // Open the file
    xmlhttp.open("GET", filename, false);
    // 
    xmlhttp.overrideMimeType("application/document");
    // 
    xmlhttp.send(null);
    // Return the text
    return xmlhttp.responseText;
}

// Renders everything on screen and checks to see if we have changed our envMap in params to a different renderTarget.
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    newCubeMaterial = cubeMaterial.uniforms.tCube.value;
    switch(params.envMap){
        case "Dawn":  newCubeMaterial = dawnRenderTarget ? dawnRenderTarget : null; myMaterial = dawnMaterial; break;
        case "Sunrise": newCubeMaterial = sunriseRenderTarget ? sunriseRenderTarget : null; myMaterial = sunriseMaterial; break;
        case "Morning":  newCubeMaterial = morningRenderTarget ? morningRenderTarget : null; myMaterial = morningMaterial; break;
        case "Noon": newCubeMaterial = noonRenderTarget ? noonRenderTarget : null; myMaterial = noonMaterial; break;
        case "Afternoon":  newCubeMaterial = afternoonRenderTarget ? afternoonRenderTarget : null; myMaterial = afternoonMaterial; break;
        case "Evening": newCubeMaterial = eveningRenderTarget ? eveningRenderTarget : null; myMaterial = eveningMaterial; break;
        case "Sunset":  newCubeMaterial = sunsetTarget ? sunsetTarget : null; myMaterial = sunsetMaterial; break;
        case "Dusk": newCubeMaterial = duskRenderTarget ? duskRenderTarget : null; myMaterial = duskMaterial; break;
    }
    // Checks to see if they are the same cause we don't want to change that if it is.
    if(newCubeMaterial !== cubeMaterial.uniforms.tCube.value){
        cubeMaterial.uniforms.tCube.value = newCubeMaterial;
        updateObjectMaterial(lambo.obj, myMaterial);
        updateObjectMaterial(mercedes.obj, new THREE.MeshPhongMaterial({color: 0xffffff, shininess:100, envMap: newCubeMaterial}));
        sphere.material = new THREE.MeshPhongMaterial({color: 0xffffff, shininess:100, envMap: newCubeMaterial});
    }
    if(mercedes.obj !== undefined){
        mercedes.obj.rotation.y += 0.001;
        dirLight.target = mercedes.obj;
    }
    if (sphereUp)
    {
        if (sph.position.y > sphereMaxHeight)
        {
            sphereUp = false;
            sph.position.y -= sphereChange;
        }
        else
        {
            sph.position.y += sphereChange;
        }
    }
    else
    {
        if (sph.position.y < sphereMinHeight)
        {
            sphereUp = true;
            sph.position.y += sphereChange;
        }
        else
        {
            sph.position.y -= sphereChange;
        }
    }
    switch(params.Light){
        case "Ambient": scene.add(ambient); break;
        case "No Ambient": scene.remove(ambient); break;
            
    }
    renderer.render(scene, camera);
}

window.onload = init();
