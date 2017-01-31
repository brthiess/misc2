from PIL import Image
import pyscreenshot as ImageGrab
import pytesseract



#DEFINITIONS
TOP_LEFT_BUTTON = (732,334,757,354)
TOP_RIGHT_BUTTON = (1177,338,1202,360)
BOTTOM_BUTTON = (1018,501,1044,522)

def hasButton(im):
	red = 0;
	for pixel in im.getdata():
		red += pixel[0];
	if(red > 80000 and red < 90000):	
		return True
	return False

def getCard(im):
	return getCardNumber(im) + getCardSuit(im)
	
def getCardNumber(im):	
	return '4'

def getCardSuit(im):
	red = 0;
	green = 0;
	blue = 0;
	for pixel in im.getdata():
		red += pixel[0];
		green += pixel[1];
		blue += pixel[2];
	print(red);
	print(green);
	print(blue);

	if(green > 100000):
		return 'c'
	elif(red > 100000):
		return 'h'
	elif(blue > 100000):
		return 'd'
	else:
		return 's'

	

if __name__ == "__main__":
	for i in range (0,1):
	
		img = ImageGrab.grab();
		'''
		#Top left button
		im = img.crop(TOP_LEFT_BUTTON);
		if(hasButton(im)):
			print("Button is in top left")
		#im.save('../images/top-left-button.jpg', 'JPEG');
		
		
		#Top right button
		im = img.crop(TOP_RIGHT_BUTTON)
		if(hasButton(im)):
			print("Button is in top right")
		#im.save('../images/top-right-button.jpg', 'JPEG');
		
		
		#Bottom Button
		im = img.crop(BOTTOM_BUTTON)
		if(hasButton(im)):
			print("Button is in bottom")
		#im.save('../images/bottom-button.jpg', 'JPEG');	
		'''
		#First Flop Card
		im = img.crop((830,355,844,389))  
		getCardSuit(im)
		im.save('../images/first-card.jpg', 'JPEG');
		'''

		#Second Flop Card
		im = img.crop((885,355,899,389))  
		im.save('../images/second-card.jpg', 'JPEG');

		#Third Flop Card
		im = img.crop((939,355,952,389))  
		im.save('../images/third-card.jpg', 'JPEG');	
		
		#Turn
		im = img.crop((992,355,1006,389))  
		im.save('../images/fourth-card.jpg', 'JPEG');

		#river
		im = img.crop((1047,355,1060,389))    
		im.save('../images/fifth-card.jpg', 'JPEG');
		
		'''


#print(pytesseract.image_to_string(Image.open('test-european.jpg'), lang='fra'))