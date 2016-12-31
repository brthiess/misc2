import win32gui
tempWindowName=win32gui.GetWindowText (win32gui.GetForegroundWindow())
import time
while True:
    if (tempWindowName == win32gui.GetWindowText(win32gui.GetForegroundWindow())):
        pass
    else:
        tempWindowName=win32gui.GetWindowText(win32gui.GetForegroundWindow())
        #do what you want
    time.sleep(0.1)
    print (win32gui.GetWindowText(win32gui.GetForegroundWindow()))