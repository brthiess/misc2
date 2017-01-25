from PIL import Image
import pyscreenshot as ImageGrab
import pytesseract


if __name__ == "__main__":
	for i in range (0,1):
		#Top left button
		im = ImageGrab.grab(bbox=(732,334,757,354))  
		im.save('../images/top-left-button.jpg', 'JPEG');
		
		#Top right button
		im = ImageGrab.grab(bbox=(1177,338,1202,360))  
		im.save('../images/top-right-button.jpg', 'JPEG');
		
		#Bottom Button
		im = ImageGrab.grab(bbox=(1018,501,1044,522))  
		im.save('../images/bottom-button.jpg', 'JPEG');	
#print(pytesseract.image_to_string(Image.open('test-european.jpg'), lang='fra'))