from PIL import Image
from PIL import ImageChops
import pyscreenshot as ImageGrab
import pytesseract
import re
from threading import Timer



#DEFINITIONS
TOP_LEFT_BUTTON = (732,334,757,354)
TOP_RIGHT_BUTTON = (1177,338,1202,360)
BOTTOM_BUTTON = (1018,501,1044,522)
TOP_LEFT_PLAYER = (607, 327, 689, 330)
TOP_RIGHT_PLAYER = (1238, 327, 1321, 330)
SHOW_ERRORS = False

#Globals
previous_position = ''
previous_cards = ''
previous_num_players = ''

def hasButton(im):
	red = 0;
	for pixel in im.getdata():
		red += pixel[0];
	if(red > 80000 and red < 90000):	
		return True
	return False

def hasPlayer(im):
	white = 0;
	red = 0;
	green = 0;
	blue = 0;
	for pixel in im.getdata():
		white += pixel[0] + pixel[1] + pixel[2]
		red += pixel[0];
		green += pixel[1];
		blue += pixel[2];

	if(red == 0 or blue == 0 or green == 0):
		return False
	if(white > 30000):
		return False
	if(red > 25000 or green > 25000 or blue > 25000):
		return False
	return True;
	
	
def getCard(im):
	cardNumber = getCardNumber(im)
	if(cardNumber != ''):
		return cardNumber + getCardSuit(im)
	else:
		return ''
	
def notACardNumber(number):
	if(number.strip() != '' and number != 'A' and number != 'K' and number != 'Q' and number != 'J' and number != 'T' and number != '9' and number != '8' and number != '7' and number != '6' and number != '5' and number != '4' and number != '3' and number != '2'):
		return True
	return False
	
def getBestNumber(numbers):
	for number in numbers:
		if(number >= 1500 or number <= 0):
			numbers.remove(number)
	print(numbers);
	
	flagged_numbers = []
	for i in range(0, len(numbers)):
		for k in range(i, len(numbers)):
			#Check for unequal numbers
			if (numbers[i] != numbers[k]):
				if("3" in str(numbers[i]) and "3" not in str(numbers[k])): #numbers[i] is a bad number
					flagged_numbers.append(numbers[i])
				if("3" not in str(numbers[i]) and "3" in str(numbers[k])): #numbers[k] is a bad number
					flagged_numbers.append(numbers[k])
	
	print(flagged_numbers);
	for number in flagged_numbers:
		if (number in numbers):
			numbers.remove(number)
	print(numbers);
	return 1
	
def getText(im):
	text1 = pytesseract.image_to_string(im);
	print(text1);
	im_black = im.convert('1')
	text1 = pytesseract.image_to_string(im_black);
	return text1

def getStack(im):
	number1 = re.sub('[^0-9]','', pytesseract.image_to_string(im))
	
	im_black = im.convert('1')
	number2 = re.sub('[^0-9]','', pytesseract.image_to_string(im_black))
	
	im.save("../images/stack-reopen.jpg")
	im2 = Image.open("../images/stack-reopen.jpg");
	im2_black = im2.convert('1')
	number3 = re.sub('[^0-9]','', pytesseract.image_to_string(im2_black))
	
	print(number1)
	print(number2)
	print(number3)
	
	numbers = []
	if(number1 != ''):
		numbers.append(int(number1))
	if(number2 != ''):
		numbers.append(int(number2))
	if(number3 != ''):
		numbers.append(int(number3))
	
	number = getBestNumber(numbers);
	
	return number

	
def convertToNumber(im):
	number = pytesseract.image_to_string(im)
	if(number == '-5%'):
		number = 'K'
	if(number == 'Ill' or number == 'ID' or number == 'IU' or number == 'if)' or number == 'IS'):
		number = 'T'
	if(number == 'CA'):
		number = 'Q'
	if(notACardNumber(str(number))):
		print('error in retrieving number');
		print('Number: ' + number)
		number = ''
	return number
	
def getCardNumber(im):	
	im_crop = im.crop((0,0,13,17))  
	
	im_crop_black = im_crop.convert('1') # convert image to black and white
	#im_crop.save('../images/testest.jpg');	
	number1 = convertToNumber(im_crop_black)
	
	if(number1 == '5'):
	
		#number2
		im_crop_gray = im_crop.convert('L') # convert image to black and white
		number2 = convertToNumber(im_crop_gray)
		
		#number 3
		number3 = convertToNumber(im_crop)
		
		#number 4 - Save and re-open image.  Seems to work for some reason...
		number4 = ''
		if(number2 == '5' and number3 == '5'):
			
			im.save('../images/reopen.png');
			im2 = Image.open('../images/reopen.png')
			im2_crop = im2.crop((0,0,13,17))
			im2_crop_black = im2_crop.convert('1')
			number4 = convertToNumber(im2_crop_black)
			
			white = 0;
			im_crop2 = im_crop.crop((2, 10, 4, 12))
			for pixel in im_crop2.getdata():
				white += pixel[0] + pixel[1] + pixel[2]
			if (white > 200):
				number1 = '5'
			else:
				number1 = '6'
				number2 = '6'
				number3 = '6'
				number4 = '6'
			
			
		
		if(SHOW_ERRORS == True):
			print(number1);
			print(number2);
			print(number3);
			if(number4 != ''):
				print(number4);
		
		if(number1 != number2 or number3 != number1 or number2 != number3 or (number4 != '' and number4 != number3)):
			if(SHOW_ERRORS == True):
				print("Error in agreement")
				print("Grayscale: " + number1)
				print("Black: " + number2)
				print("Normal: " + number3)
				if(number4 != ''):
					print("Saved: " + number4)
			if (number2 == number3):
				number1 = number2
			if(number4 == '6'):
				number1 = number4
	if(number1 == '' and getCardSuit(im) == 'c'):
		number2 = convertToNumber(im_crop)
		if(number2 == '5'):
			number1 = number2
	return number1.lower()

	
def getCardSuit(im):
	red = 0;
	green = 0;
	blue = 0;
	for pixel in im.getdata():
		red += pixel[0];
		green += pixel[1];
		blue += pixel[2];

	#print(red)	
	#print(green)
	#print(blue)
	
	if(green > red and green > blue):
		return 'c'
	elif(red > green and red > blue):
		return 'h'
	elif(blue > green and blue > red):
		return 'd'
	else:
		return 's'

		
def screenGrab():
	img = ImageGrab.grab();
	
	print("\n\n******************************")
		
	numPlayers = 1;
	
	
	#Top Left Player
	im = img.crop(TOP_LEFT_PLAYER)
	if(hasPlayer(im)):
		numPlayers += 1
	#im.save('../images/top-left-player.jpg', 'JPEG');	
	
	#Top Right Player
	im = img.crop(TOP_RIGHT_PLAYER)
	if(hasPlayer(im)):
		numPlayers += 1;
	#im.save('../images/top-right-player.jpg', 'JPEG');
	
	print("# of Players: " + str(numPlayers));
	
	if(numPlayers != 1):
		text_file = open("../states/num-players.txt", "w")
		text_file.write(str(numPlayers))
		text_file.close()
	else:
		print("ERROR: No players found")
	
	
	position = ''
	#Top left button
	im = img.crop(TOP_LEFT_BUTTON);
	if(hasButton(im)):
		if(numPlayers == 3):
			position = 'pbb'
		else:
			position = 'pbb'
		print("Button is in top left")
	#im.save('../images/top-left-button.jpg', 'JPEG');
	
	
	
	#Top right button
	im = img.crop(TOP_RIGHT_BUTTON)
	if(hasButton(im)):
		if(numPlayers == 3):
			position = 'psb'
		else:
			position = 'pbb'
		print("Button is in top right")
	#im.save('../images/top-right-button.jpg', 'JPEG');
	
	global previous_num_players
	if(previous_num_players != numPlayers):
		text_file = open("../states/new-round.txt", "w")
		text_file.write('true')
		text_file.close()
	
	previous_num_players = numPlayers;
	
	#Bottom Button
	im = img.crop(BOTTOM_BUTTON)
	if(hasButton(im)):
		if(numPlayers == 3):
			position = 'pb'
		else:
			position = 'psb'
		print("Button is in bottom")
	#im.save('../images/bottom-button.jpg', 'JPEG');	
	
	global previous_position
	if(position != previous_position):
		text_file = open("../states/new-round.txt", "w")
		text_file.write('true')
		text_file.close()
		
	if(position != ''):
		text_file = open("../states/position.txt", "w")
		text_file.write(position)
		text_file.close()
	else:
		text_file = open("../states/position.txt", "w")
		text_file.write('')
		text_file.close()
		print("ERROR: No position found")

	previous_position = position
	
	

	
	
	
	#My First Card
	im = img.crop((914,513,927,547))
	#im = Image.open("../images/asdfasdf.png")
	card1 = getCard(im)
	if(card1.strip() != ''):
		print('My First Card: ' + card1)
	else:
		print('I have no first card')
	#im.save('../images/my-first-card.jpg', 'JPEG');
	
	#My Second Card
	im = img.crop((962,513,975,547))
	#im = Image.open("../images/templates/6s.jpg")
	card2 = getCard(im)
	if(card2.strip() != ''):
		print('My Second Card: ' + card2)
	else:
		print('I have no second card')
	#im.save('../images/my-second-card.jpg', 'JPEG');
	
	myCards = card1 + card2
	text_file = open("../states/my-cards.txt", "w")
	text_file.write(myCards)
	text_file.close()
	
	global previous_cards
	if(previous_cards != myCards):
		text_file = open("../states/new-round.txt", "w")
		text_file.write('true')
		text_file.close()
	
	previous_cards = myCards

	
	#First Flop Card
	im = img.crop((830,355,843,389))
	#im = Image.open("../images/templates/6s.jpg")
	card1 = getCard(im)
	if(card1.strip() != ''):
		print('First Flop Card: ' + card1)
	else:
		print('No First Flop Card')
	#im.save('../images/first-card.jpg', 'JPEG');
	
	
	
	#Second Flop Card
	im = img.crop((885,355,898,389))  
	card2 = getCard(im)
	if(card2.strip() != ''):
		print('Second Flop Card: ' + card2)
	else:
		print('No Second Flop Card')
	#im.save('../images/second-card.jpg', 'JPEG');

	#Third Flop Card
	im = img.crop((939,355,952,389))  
	card3 = getCard(im)
	if(card3.strip() != ''):
		print('Third Flop Card: ' + card3)
	else:
		print('No Third Flop Card')
	#im.save('../images/third-card.jpg', 'JPEG');	
	
	flop = card1 + card2 + card3
	text_file = open("../states/flop.txt", "w")
	text_file.write(flop)
	text_file.close()
	
	
	
	#Turn
	im = img.crop((993,355,1006,389))  
	turn = getCard(im)
	if(turn != ''):
		print('Turn Card: ' + turn)
	else:
		print('No Turn Card')
	#im.save('../images/fourth-card.jpg', 'JPEG');

	
	
	text_file = open("../states/turn.txt", "w")
	text_file.write(turn)
	text_file.close()
	
	#river
	im = img.crop((1047,355,1060,389))  
	river = getCard(im)
	if(river != ''):
		print('River Card: ' + river)
	else:
		print('No River Card')		
	#im.save('../images/fifth-card.jpg', 'JPEG');
	
	text_file = open("../states/river.txt", "w")
	text_file.write(river)
	text_file.close()
	
	
	#Set updated = true
	text_file = open("../states/updated.txt", "w")
	text_file.write('true')
	text_file.close()
	
	r = Timer(1, screenGrab)
	r.start()
	
	

if __name__ == "__main__":
	screenGrab()

	
		
		
		
		


#print(pytesseract.image_to_string(Image.open('test-european.jpg'), lang='fra'))