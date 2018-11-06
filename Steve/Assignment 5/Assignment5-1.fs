// Fragment shader for Assignment 5
// By: Steven Zielinski

precision highp float;

uniform vec3 diffuseColor;

uniform sampler2D texture;

// Get the normal vector and camera position from the vertex shader
varying vec3 normalVector;
varying vec4 vPosition;

void main()
{
    // Normalize the normal vector
    vec3 NVector = normalize(normalVector);

    float theta = acos(NVector.z);
    float phi = atan(NVector.y / NVector.x);

    float pi = 3.1415926535;

    vec2 coord = vec2(theta / pi, phi / (2 * pi));

    vec3 mattColor = (diffuseColor / pi) * texture2D(texture, coord);

    // Use the new color to shade the fragment
    gl_FragColor = vec4(mattColor, 1.0);
}