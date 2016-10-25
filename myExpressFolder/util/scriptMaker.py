import sys
from Tkinter import *



class Application(Frame):
    def say_hi(self):
        print "hi there, everyone!"

    def save(self):
        print "Saving..."

    # def exit(self):
    #     sys.exit(0)

    def createWidgets(self):
        self.menuButton = Menubutton(self)
        self.menuButton["text"] = "File"

        self.menu = Menu(self.menuButton);
        self.menu.add_command(label="Save", command=self.save());
        # self.menu.add_command(label="Exit", command=self.exit());

        self.menuButton['menu'] = self.menu
        self.menuButton.pack({"side":"left"})

        self.QUIT = Button(self)
        self.QUIT["text"] = "QUIT"
        self.QUIT["fg"]   = "red"
        self.QUIT["command"] =  self.quit

        self.QUIT.pack({"side": "left"})

        self.Save = Button(self)
        self.Save["text"] = "Save",
        self.Save["command"] = self.save

        self.Save.pack({"side": "left"})

        self.mess = Message(self)
        self.mess["text"] = "This is my message"
        self.mess.pack({"side":"left"})

    def __init__(self, master=None):
        Frame.__init__(self, master)
        self.pack()
        self.createWidgets()

root = Tk()
app = Application(master=root)
app.mainloop()
root.destroy()
