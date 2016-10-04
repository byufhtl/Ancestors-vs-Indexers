#
# PPM to JS Python converter
# author: Calvin McMurray (c) 2016
#
#

import sys
import getopt
import json

files = {}




def printFile(args):
    try:
        filename = args[0]
        currfile = files[filename]
        print("W: " + str(currfile['w']) + " L: " + str(currfile['l']))
        print(str(currfile['arr']))
    except:
        print("Could not print file \"" + filename + "\"")


def report(args):
    try:
        filename = args[0]
        currfile = files[filename]
        types = {}
        print("W: " + str(currfile['w']) + " L: " + str(currfile['l']))
        for i in range(len(currfile['arr'])):
            for j in range(len(currfile['arr'][i])):
                entry = currfile['arr'][i][j]
                # print(entry)
                if types.has_key(entry):
                    types[entry] += 1
                else:
                    types[entry] = 1
        # print "Parsed file: " + str(types)
        print("Pixel Types and Counts:")
        for key in types.keys():
            print str(key) + ": " + str(types.get(key))
        print("----------------------------------------------")
    except:
        print("Could not print report for file \"" + filename + "\"")

def getType(code):
    return {
        'aaffaa': 'U',  # Unwalkable Tile
        '5e5e5e': 'O',  # Walkable Tile
        '000000': 'F',  # High-speed Tile
        '005500': 'W',  # Slow-speed Tile
        'ffffff': 'R',  # Risk Tile
        '000055': 'L',  # Locked Tile
        '550000': 'C',  # Secure (Hazard-less) Tile
        '00ff00': 'N',  # Environment (Unwalkable) Tile
        '0000ff': 'P',  # Portal Tile
        '00ffff': 'V',  # Event Tile
        'ff0000': 'E'   # End Point (Goal) Tile
    }.get(str(code),'U')

def readout(args):
    try:
        filename = args[0]
        outfilename = args[1]
        currfile = files[filename]
        out = "["
        print("W: " + str(currfile['w']) + " L: " + str(currfile['l']))
        for i in range(len(currfile['arr'])):
            out += "["
            for j in range(len(currfile['arr'][i])):
                entry = currfile['arr'][i][j]
                out += "\"" + getType(entry) + "\","
            out = out[:-1]
            out += "],\n"
        # print "Parsed file: " + str(types)
        out = out [:-2]
        out += "]"
        f = open(outfilename,'w')
        f.write(str(out))
        f.close()
    except:
        print "Could not write out \"" + filename + "\" to \"" + outfilename + "\""

def readTuple(string):
    r = int(string[0]) # grab the r value
    g = int(string[1]) # grab the g value
    b = int(string[2]) # grab the b value
    return "{:02x}".format(r) + "{:02x}".format(g) + "{:02x}".format(b) # format and return

def stripHeader(string):
    #Yeah, I'm not super worried at the moment, but this needs to get ramped up to deal with a ppm image properly
    string = string[1:]
    line = ""
    while(True):
        line = string[0]
        string = string[1:]
        # print("Str: " + line)
        for s in line:
            if not s.isdigit():
                continue
        break
    return string

def readin(args):
    try:
        filename = args[0]
        f= open(filename,'r')
        file_content = f.read().split("\n")

        file_content = stripHeader(file_content)
        dims = file_content[0].split(" ");
        file_content = file_content[2:]
        # print("Dims: " + str(dims))
        dwid = int(dims[0])
        dlen = int(dims[1])
        arr = []
        for i in range(dwid):
            inarr = []
            for j in range(dlen):
                tup = readTuple(file_content)
                # print "Tuple: \"" + tup + "\""
                # print "Local arr I: " + str(inarr)
                inarr.append(str(tup))
                # print "Local arr II: " + str(inarr)
                file_content = file_content[3:]
                # print "Trunc'd"
            arr.append(inarr)

        files[filename] = {'arr':arr,'w':dwid,'l':dlen}

        f.close()
        # print(str(files[filename]))
    except:
        print("Error reading in file \"" + filename + "\"")

def printHelp():
    print("in <filename>                read a file into memory.")
    print("out <stored file> <out file> to write stored memory out into a file.")
    print("report <stored file>         print out a quick report on a file.")
    print("print <stored file>          print out a stored file.")

def prompt():
    taskArr = raw_input("% ").split(" ")
    comm = taskArr[0].lower();
    if(comm == "in"):
        readin(taskArr[1:])
    elif(comm == "out"):
        readout(taskArr[1:])
    elif(comm == "report"):
        report(taskArr[1:])
    elif(comm == "print"):
        printFile(taskArr[1:])
    elif(comm == "help"):
        printHelp()
    elif(comm == "quit" or comm == "exit"):
        sys.exit(0)
    else:
        print("Could not recognize command \"" + comm + "\".")

def main(argl):
    try:
        opts, args = getopt.getopt(argl, "");
        print("Welcome to the converter. Type 'help' for help")
        while(True):
            prompt()
    except getopt.GetoptError:
        print("usage: python ppmConverter.py")
        sys.exit(1);

main(sys.argv)
