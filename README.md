# GraphicsProject
Tim and Steve Final Project for COP 5725 with Sumanta Pattanaik.

# Images
All images were found on https://hdri-skies.com/ these images
can be found in the images folder and are in their own seperate
folders based on the time of day of the photos. Each photo is named
depending on which direction you are looking at on each axis. We also
store the respective irradiance map we computed in this folder as well
as a .out file.

# JavaScript files
All our JavaScript code is housed in the js folder. Our main project file
is run off of project.js and our index.html file loads in all the JavaScript
files with the script tags.

# Objects
All the objects we found on the internet were from the website: https://www.turbosquid.com/Search/3D-Models/free
They all come with their own mtl and obj files, but we opted to not use the mtl
and instead use our own materials. The lamborginhi comes with it's own
diffuse, gloss, and spec .jpegs that came with the download. We again
didn't use these because we didn't use the mtl for the model.

# Steve
Our IrradianceMapGenerator.java is housed in the Steve folder. This is the
file we used to generate all the points on our Irradiance Map. There is 
another file called IrradianceMapGeneratorWithThreads.java that was our
attempt at speeding up our generation by using threads to multitask our
generation, but everytime we ran it we would get the incorrect results and we
could not figure out what was wrong.

# Things to make mention of
We ran across some issues with the Irradiance Map Generation; we keep getting
hard edges with noticable transfer of color difference when we apply it to our
sphere. We have tried everything, but do not see where the problem lies in our
IrradianceMapGenerator.java file. 

Everything else should be understandable and if you have any questions you
can email us and we'll answer as soon as possible.