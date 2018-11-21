var scene;
var camera;
var renderer;
var controls;
// Albedo is our reflection

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
    setupCamera();
    setupRenderer();
    setupControls();
    
    var path = "images/";
    var format = ".png";
    var urls = [
        path +"px"+format, path+"nx"+format,
        path +"py"+format, path+"ny"+format,
        path +"pz"+format, path+"nz"+format
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load( urls );
    reflectionCube.format = THREE.RGBFormat;
    scene.background = reflectionCube;
    
    var geometry = new THREE.SphereGeometry(12, 32, 32);
    var material = new THREE.MeshLambertMaterial({color: 0x2194ce, transparent: true, opacity: 0.5});
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    //lights
    var ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );
    /*var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;
    //var material = new THREE.MeshBasicMaterial({color: 0xffffff, envMap: textureCube});
    scene.background = reflectionCube;
    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);*/
    animate();
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function setupCamera(){
    camera.position.z = 2000;
    //camera.lookAt(scene.position);
}

function setupRenderer(){
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function setupControls(){
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 15;
    controls.maxDistance = 35;
}
window.onload = init();

