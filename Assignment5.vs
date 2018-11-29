// Vertex shader for assignment 5
// By: Steven Zielinski

precision highp float;

// Uniforms from ThreeJS camera
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

// Attributes loaded from the buffer
attribute vec3 position;
attribute vec3 normal;

// Varying value for the normal and camera position to pass to the fragment 
// shader
varying vec3 normalVector;
varying vec4 vPosition;

void main()
{
    // Calculate the postion in the camera space
    vPosition = modelViewMatrix * vec4(position, 1.0);

    // Calculate the normal vector that will be used in the fragment shader
    normalVector = normalize(normal);

    // Find the final position of each vertex
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}