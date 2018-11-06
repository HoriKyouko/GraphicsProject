/**
 * Created by Timothy Garrett
 * 11/2/18
 * For CAP 5725 Fall 2018
 * Professor Sumanta Pattanaik
 */
var scene;
var camera;
var renderer;
var controls;
// Albedo is our reflection
var albedo = 1;

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    setupCamera();
    setupRenderer();
    setupControls();
	
	var cubeEnvLight = creatingRectangle();
    var point = new THREE.Vector3(0,0,0); // we know the point is at the center of the rectangle which happens to be (0,0,0)
    var irradianceTable = [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ];
     var thetaPhiTable = [
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ];
    var rows = irradianceTable.length;
	var cols = irradianceTable[0].length;
    thetaPhiTable = computeNormals(thetaPhiTable, rows, cols); // creates our normal table to be used in finding the irradiance table.
    irradianceTable = createIrradianceMap(cubeEnvLight, point, irradianceTable, thetaPhiTable, rows, cols); // creates our irradiance table.
    
    let vShaderCode = document.getElementById("vertexShader").textContent;
    let fShaderCode = document.getElementById("fragmentShader").textContent;
    // Not entirely sure what were suppose to use the rawshadermaterial here for as there wasn't any object to put the material on.
    // Unless I missed something in class stating we needed an object in the code.
    var material = new THREE.RawShaderMaterial({
        fragmentShader: fShaderCode,
        vertexShader: vShaderCode,
        uniforms: {
            irradiance: {type: "t", value: new THREE.DataTexture(irradianceTable, rows, cols, THREE.RGBFormat)}
        }
    });   
    
    animate();
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function setupCamera(){
    camera.position.z = 25;
    camera.lookAt(scene.position);
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

function creatingRectangle() {
	var A, B, C, D, E, F, G, H;
    var topFace, bottomFace, frontFace, backFace, leftFace, rightFace;
    var topNormal, bottomNormal, frontNormal, backNormal, leftNormal, rightNormal;
    var length = 2, width = 2;
	let power = 1;
	// Creating boundaries of our square and the normals of it since we know these values we can hardcode the normals else it would be a simple crossproduct.
    A = new THREE.Vector3(-1,-1,-1);
    B = new THREE.Vector3( 1,-1,-1);
    C = new THREE.Vector3(-1, 1,-1);
    D = new THREE.Vector3( 1, 1,-1);
    E = new THREE.Vector3(-1,-1, 1);
    F = new THREE.Vector3( 1,-1, 1);
    G = new THREE.Vector3(-1, 1, 1);
    H = new THREE.Vector3( 1, 1, 1);
    topNormal = new THREE.Vector3( 0, 1, 0);
    bottomNormal = new THREE.Vector3( 0, -1, 0);
    frontNormal = new THREE.Vector3( 0, 0, -1);
    backNormal = new THREE.Vector3(  0, 0, 1);
    leftNormal = new THREE.Vector3( -1, 0, 0);
    rightNormal = new THREE.Vector3( 1, 0, 0);
    // Create our face objects.
    topFace = {
        "point1": C,
        "point2": D,
        "point3": G,
        "point4": H,
        "line1": D.clone().sub(C),
        "line2": G.clone().sub(C),
        "normal": topNormal
    }
    bottomFace = {
        "point1": A,
        "point2": B,
        "point3": E,
        "point4": F,
        "line1": B.clone().sub(A),
        "line2": E.clone().sub(A),
        "normal": bottomNormal
    }
    frontFace = {
        "point1": A,
        "point2": B,
        "point3": C,
        "point4": D,
        "line1": B.clone().sub(A),
        "line2": C.clone().sub(A),
        "normal": frontNormal
    }
    backFace = {
        "point1": E,
        "point2": F,
        "point3": G,
        "point4": H,
        "line1": F.clone().sub(E),
        "line2": G.clone().sub(E),
        "normal": backNormal
    }
    leftFace = {
        "point1": A,
        "point2": E,
        "point3": C,
        "point4": G,
        "line1": E.clone().sub(A),
        "line2": C.clone().sub(A),
        "normal": leftNormal
    }
    rightFace = {
        "point1": B,
        "point2": F,
        "point3": D,
        "point4": H,
        "line1": F.clone().sub(B),
        "line2": D.clone().sub(B),
        "normal": rightNormal
    }
	return {
		"topFace": topFace,
		"bottomFace": bottomFace,
		"frontFace": frontFace,
		"backFace": backFace,
		"leftFace": leftFace,
		"rightFace": rightFace,
        "width" : width,
		"length": length,
		"area": length * width,
		"Phi" : power
	}
}

function createIrradianceMap(cubeEnvLight, point, table, normal, rows, cols){
	for(var i = 0; i < rows; i++){
		for(var j = 0; j < cols; j++){
			table[i][j] = populateTable(cubeEnvLight, point, cols, rows, normal[i][j]); // finds our irradiance at every normal for the fragment.
		}
	}
	return table;
}

function populateTable(cubeEnvLight, point, cols, rows, fragNormal){
    var face;
    var normal;
    var corner;
    var summation = 0;

    var E = cubeEnvLight.Phi/cubeEnvLight.area;
    var radiance = E/Math.PI;
    var dA = cubeEnvLight.area/(rows*cols);
    var constant = albedo/Math.PI;
    for(z = 0; z < 6; z++){
		if(z == 0){
            face = cubeEnvLight.frontFace; // frontFace
            corner = face.point1;
            normal = face.normal;
		}
		else if(z == 1){
            face = cubeEnvLight.backFace; // backFace
            corner = face.point1;
            normal = face.normal;
		}
		else if(z == 2){
            face = cubeEnvLight.topFace; // topFace
            corner = face.point1;
            normal = face.normal;
		}
		else if(z == 3){
			face = cubeEnvLight.bottomFace; // bottomFace
            corner = face.point1;
            normal = face.normal;
        }
		else if(z == 4){
            face = cubeEnvLight.leftFace; // leftFace
            corner = face.point1;
            normal = face.normal;
		}
		else {
            face = cubeEnvLight.rightFace; // rightFace
            corner = face.point1;
            normal = face.normal;
		}
		for(var i = 0; i < rows; i++){
			for(var j = 0; j < cols; j++){			
                let iCenter = (i+.5)/rows;
                let jCenter = (j+.5)/cols;
                let newLine1 = face.line1.multiplyScalar(iCenter);
                let newLine2 = face.line2.multiplyScalar(jCenter);
                let center = new THREE.Vector3();
                center.addVectors(newLine1, newLine2);
                let P = corner.add(center); // Center of our Rectangle.

                let lengthQPsq = (P.x*P.x + P.y*P.y + P.z*P.z); // Length of our distance vector squared.

                let dir = P.normalize(); // Allows our length to be 1 which is useful in the next parts.

                let cosineTheta_Q = (fragNormal.dot(dir)); // This gives us our angle between the normal of the fragment and the distance vector L.

                let cosineTheta_P = normal.dot(dir.negate()); // This gives us our angle between the normal of the rectangle and the distance vector L.
                summation += radiance * ((cosineTheta_Q * cosineTheta_P)/lengthQPsq) * dA; // We add up our values we just computed.
			}
		}
	}
    return constant * summation;
}

function computeNormals(normal, rows, cols){
    var deltaTheta = Math.PI/rows; // compute how much we will rotate theta
    var deltaPhi = (2*Math.PI)/cols; // compute how much we will rotate phi
    var i = 0, j = 0; // tabling values
    for(var theta = 0; theta < (Math.PI-.1); theta += deltaTheta){
        for(var phi = 0; phi < (2*Math.PI-.1); phi += deltaPhi){
            normal[i][j] = new THREE.Vector3(Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)); // placing the normals in the normal array.
            j++;
        }
        j = 0;
        i++;
    }
    return normal
}
window.onload = init();

