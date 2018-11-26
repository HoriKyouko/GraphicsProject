
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.*;
import javax.imageio.*;

public class IrradianceMapGenerator 
{
	public static void main(String[] args) 
	{
		/*BufferedImage img = LoadImage("neg-x.png");
		
		Color curColor = new Color(img.getRGB(0, 0));
		
		System.out.println(curColor.getRed() + " " + curColor.getGreen() + 
				" " + curColor.getBlue() + " " + curColor.getAlpha());*/
		
		BufferedImage[] images = new BufferedImage[6];
		images[0] = LoadImage("neg-x.png");
		images[1] = LoadImage("neg-y.png");
		images[2] = LoadImage("neg-z.png");
		images[3] = LoadImage("pos-x.png");
		images[4] = LoadImage("pos-y.png");
		images[5] = LoadImage("pos-z.png");
		
		// Create the arrays that will hold the positions of the corners of 
		// the sides
		double[][] A = new double[6][3];
		double[][] B = new double[6][3];
		double[][] C = new double[6][3];
		double[][] D = new double[6][3];
		
		double[][] AB = new double[6][3];
		double[][] AD = new double[6][3];
		
		// Create the array for the normal of each side
		double[][] faceNormal = new double[6][3];
		
		for (int curImage = 0; curImage < 6; curImage++)
		{
			switch (curImage)
			{
			case 0:
				A[curImage][0] = -1.0; A[curImage][1] = -1.0; A[curImage][2] = 1.0;
				B[curImage][0] = -1.0; B[curImage][1] = -1.0; B[curImage][2] = -1.0;
				C[curImage][0] = -1.0; C[curImage][1] = 1.0; C[curImage][2] = -1.0;
				D[curImage][0] = -1.0; D[curImage][1] = 1.0; D[curImage][2] = 1.0;
				//faceNormal[curImage][0] = 1.0; faceNormal[curImage][1] = 0.0; faceNormal[curImage][2] = 0.0;  
				break;
			case 1:
				A[curImage][0] = -1.0; A[curImage][1] = -1.0; A[curImage][2] = 1.0;
				B[curImage][0] = 1.0; B[curImage][1] = -1.0; B[curImage][2] = 1.0;
				C[curImage][0] = 1.0; C[curImage][1] = -1.0; C[curImage][2] = -1.0;
				D[curImage][0] = -1.0; D[curImage][1] = -1.0; D[curImage][2] = -1.0;
				//faceNormal[curImage][0] = 0.0; faceNormal[curImage][1] = 1.0; faceNormal[curImage][2] = 0.0;
				break;
			case 2:
				A[curImage][0] = -1.0; A[curImage][1] = -1.0; A[curImage][2] = -1.0;
				B[curImage][0] = 1.0; B[curImage][1] = -1.0; B[curImage][2] = -1.0;
				C[curImage][0] = 1.0; C[curImage][1] = 1.0; C[curImage][2] = -1.0;
				D[curImage][0] = -1.0; D[curImage][1] = 1.0; D[curImage][2] = -1.0;
				//faceNormal[curImage][0] = 0.0; faceNormal[curImage][1] = 0.0; faceNormal[curImage][2] = 1.0;
				break;
			case 3:
				A[curImage][0] = 1.0; A[curImage][1] = -1.0; A[curImage][2] = 1.0;
				B[curImage][0] = 1.0; B[curImage][1] = -1.0; B[curImage][2] = -1.0;
				C[curImage][0] = 1.0; C[curImage][1] = 1.0; C[curImage][2] = -1.0;
				D[curImage][0] = 1.0; D[curImage][1] = 1.0; D[curImage][2] = 1.0;
				//faceNormal[curImage][0] = -1.0; faceNormal[curImage][1] = 0.0; faceNormal[curImage][2] = 0.0;
				break;
			case 4:
				A[curImage][0] = -1.0; A[curImage][1] = 1.0; A[curImage][2] = -1.0;
				B[curImage][0] = 1.0; B[curImage][1] = 1.0; B[curImage][2] = -1.0;
				C[curImage][0] = 1.0; C[curImage][1] = 1.0; C[curImage][2] = 1.0;
				D[curImage][0] = -1.0; D[curImage][1] = 1.0; D[curImage][2] = 1.0;
				//faceNormal[curImage][0] = 0.0; faceNormal[curImage][1] = -1.0; faceNormal[curImage][2] = 0.0;
				break;
			case 5:
				A[curImage][0] = -1.0; A[curImage][1] = -1.0; A[curImage][2] = 1.0;
				B[curImage][0] = 1.0; B[curImage][1] = -1.0; B[curImage][2] = 1.0;
				C[curImage][0] = 1.0; C[curImage][1] = 1.0; C[curImage][2] = 1.0;
				D[curImage][0] = -1.0; D[curImage][1] = 1.0; D[curImage][2] = 1.0;
				//faceNormal[curImage][0] = 0.0; faceNormal[curImage][1] = 0.0; faceNormal[curImage][2] = -1.0;
				break;
			}// End switch for the image type to determine the corners of the face
			
			AB[curImage] = createVector3(A[curImage], B[curImage]);
			AD[curImage] = createVector3(A[curImage], D[curImage]);
			
			faceNormal[curImage] = normalize(crossVector3(AB[curImage], AD[curImage]));
		}// This ends the for loop for the faces
		
		// Create the array that will store the irradiance map
		int[] finalArray = new int[360 * 180 * 4];
		
		for (int phi = 0; phi < 360; phi++)
		{
			System.out.println("phi = " + phi);
			
			for (int theta = 0; theta < 180; theta++)
			{	
				double[] color = new double[4];
				
				for (int curImage = 0; curImage < 6; curImage++)
				{
					for (int curHeight = 0; curHeight < images[curImage].getHeight(); curHeight++)
					{
						for (int curWidth = 0; curWidth < images[curImage].getWidth(); curWidth++)
						{
							double x = getPos(curWidth, images[curImage].getWidth());
							double y = getPos(curHeight, images[curImage].getHeight());
							
							double[] imagePosition = getImagePos(curImage, x, y);
							
							double[] curFragNormal = getNormalfromAngles(theta, phi);
							
							double[] fragPosition = {0.0, 0.0, 0.0};
							
							double[] fragToImage = createVector3(fragPosition, imagePosition);
							double[] imageToFrag = createVector3(imagePosition, fragPosition);
							
							fragToImage = normalize(fragToImage);
							imageToFrag = normalize(imageToFrag);
							
							double distanceSquared = getDistance(imagePosition);
							
							double fragDot = getDot3(curFragNormal, fragToImage);
							double areaDot = getDot3(faceNormal[curImage], imageToFrag);
							
							Color curColor = new Color(images[curImage].getRGB(curWidth, curHeight));
							
							double[] ABcrossAD = crossVector3(AB[curImage], AD[curImage]);
							
							double lengthABCross = Math.sqrt(getDistance(ABcrossAD));
							
							double deltaArea = 1.0 / images[curImage].getHeight() * 2.0 * 2.0 * 1.0 / images[curImage].getWidth(); 							
							
							double scalar = fragDot * areaDot / distanceSquared * deltaArea;
							
							//System.out.println("scalar = " + scalar);
							
							color[0] += (double)curColor.getRed() * scalar;
							color[1] += (double)curColor.getGreen() * scalar;
							color[2] += (double)curColor.getBlue() * scalar;
							color[3] += (double)curColor.getAlpha() * scalar;
						}// End current width loop on the image
					}// End current height loop on the image
				}// End current Image loop
				
				System.out.println(color[0] + " " + color[1] + " " + color[2] + " " + color[3]);
				
				finalArray[phi * 720 + theta * 4 + 0] = (int)Math.max(Math.min(color[0], 255.0), 0.0);
				finalArray[phi * 720 + theta * 4 + 1] = (int)Math.max(Math.min(color[1], 255.0), 0.0);
				finalArray[phi * 720 + theta * 4 + 2] = (int)Math.max(Math.min(color[2], 255.0), 0.0);
				finalArray[phi * 720 + theta * 4 + 3] = (int)Math.max(Math.min(color[3], 255.0), 0.0);
				
				System.out.println(phi * 720 + theta * 4 + 0 + " " + finalArray[phi * 720 + theta * 4 + 0]);
				System.out.println(phi * 720 + theta * 4 + 1 + " " + finalArray[phi * 720 + theta * 4 + 1]);
				System.out.println(phi * 720 + theta * 4 + 2 + " " + finalArray[phi * 720 + theta * 4 + 2]);
				System.out.println(phi * 720 + theta * 4 + 3 + " " + finalArray[phi * 720 + theta * 4 + 3]);
				
			}// End theta loop for the normal
		}// End phi loop for the normal
		
		try
		{
			PrintWriter out = new PrintWriter("output.out");
		
			for (int i = 0; i < finalArray.length; i++)
			{
				if (i == 0)
				{
					out.print("[" + finalArray[i] + ", ");
				}
				else if (i == finalArray.length - 1)
				{
					out.println(finalArray[i] + "]");
				}
				else
				{
					out.print(finalArray[i] + ", ");
				}
			}
			
			out.close();
		}
		catch(Exception e)
		{
			System.out.println("There was an exception in file output");
		}
	}
	
	public static BufferedImage LoadImage(String path)
	{
		try
		{
			return ImageIO.read(new File(path));
		}
		catch (IOException e)
		{
			System.out.println("Couldn't read file:");
			System.out.println(path);
			return null;
		}
	}
	
	public static double[] createVector3(double[] vec1, double[] vec2)
	{
		double[] returnVector = new double[3];
		
		returnVector[0] = vec1[0] - vec2[0];
		returnVector[1] = vec1[1] - vec2[1];
		returnVector[2] = vec1[2] - vec2[2];
		
		return returnVector;
	}
	
	public static double[] crossVector3(double[] vec1, double[] vec2)
	{
		double[] returnVector = new double[3];
		
		returnVector[0] = (vec1[1] * vec2[2]) - (vec1[2] * vec2[1]);
		returnVector[1] = (vec1[0] * vec2[2]) - (vec1[2] * vec2[0]);
		returnVector[2] = (vec1[0] * vec2[1]) - (vec1[1] * vec2[0]);
		
		return returnVector;
	}
	
	public static double getDot3(double[] vec1, double[] vec2)
	{
		double x = vec1[0] * vec2[0];
		double y = vec1[1] * vec2[1];
		double z = vec1[2] * vec2[2];
		
		double answer = Math.max(Math.min(x + y + z, 1.0), 0.0);
		
		return answer;
	}
	
	public static double[] normalize(double[] vec)
	{
		double[] returnVector = new double[3];
		
		double magnitude = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
		
		returnVector[0] = vec[0] / magnitude;
		returnVector[1] = vec[1] / magnitude;
		returnVector[2] = vec[2] / magnitude;
		
		return returnVector;
	}
	
	public static double[] getNormalfromAngles(int theta, int phi)
	{
		double[] returnValue = new double[3];
		
		double radTheta = (double)theta / 180.0;
		double radPhi = (double)phi / 180.0;
		
		returnValue[0] = Math.cos(radPhi) * Math.sin(radTheta);
		returnValue[1] = Math.sin(radPhi) * Math.sin(radTheta);
		returnValue[2] = Math.cos(radTheta);
		
		return returnValue;
	}
	
	public static double getPos(int curValue, int maxValue)
	{
		double ratio = (double) curValue / (double) maxValue;
		
		return (2.0 * ratio) - 1.0;
	}
	
	public static double[] getImagePos(int image, double x, double y)
	{
		double[] returnValue = new double[3];
		
		switch (image)
		{
		case 0:
			returnValue[0] = -1.0;
			returnValue[1] = x;
			returnValue[2] = y;
			break;
		case 1:
			returnValue[0] = x;
			returnValue[1] = -1.0;
			returnValue[2] = y;
			break;
		case 2:
			returnValue[0] = x;
			returnValue[1] = y;
			returnValue[2] = -1.0;
			break;
		case 3:
			returnValue[0] = 1.0;
			returnValue[1] = x;
			returnValue[2] = y;
			break;
		case 4:
			returnValue[0] = x;
			returnValue[1] = 1.0;
			returnValue[2] = y;
			break;
		case 5:
			returnValue[0] = x;
			returnValue[1] = y;
			returnValue[2] = 1.0;
			break;
		}
		
		return returnValue;
	}
	
	public static double getDistance(double[] position)
	{
		double x = position[0] * position[0];
		double y = position[1] * position[1];
		double z = position[2] * position[2];
		
		return x + y + z;
	}
	
	public static double[] addVectors(double[] vec1, double[] vec2)
	{
		double[] answer = new double[4];
		
		answer[0] = vec1[0] + vec2[0];
		answer[1] = vec1[1] + vec2[1];
		answer[2] = vec1[2] + vec2[2];
		answer[3] = vec1[3] + vec2[3];
		
		return answer;
	}
}
