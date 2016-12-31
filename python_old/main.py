from PIL import Image
import pyscreenshot as ImageGrab
import pytesseract


if __name__ == "__main__":
	for i in range (0,1):
		im = ImageGrab.grab(bbox=(150,253,525,265))  #Top left amount in chips
		#im = ImageGrab.grab(bbox=(920,325,1004,345))  #Top left amount in chips

		#im.show()
		print(pytesseract.image_to_string(im))
#print(pytesseract.image_to_string(Image.open('test-european.jpg'), lang='fra'))