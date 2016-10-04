#
#   Text to JS Array converter
#   author: Calvin McMurray
#   Copyright BYU 2016
#
#   Converts a block of aphabetic characters from a .txt file into a java array.
#   Created to make map creation for RecordHunter game simple
#   Does not create the map objects. Just parses an ascii drawing of a map into an array readable in JS.
#

import sys, getopt

# Grab the command line arguments
argc = len(sys.argv)
args = sys.argv

# Parse a single char, testing for alphabetic and appending a comma
def parsechar(ch):
    if not (ch.isalpha() or ch == "\n"):
        raise Exception("Invalid char: \'" + ch + "\'")
    # print "ch:", ch
    return ch.upper() + ","

# Takes a line and parses it into something a subsection of a JS array
def readline(line):
    # print line
    linearr = []
    for char in line:
        linearr.append(parsechar(char))
    linearr.pop()
    linearr.append('\n')
    return "".join(linearr)

# Reads in a file and tries to convert it into the contents of a JS array
def readin(filename):
    jarr = '[\n'
    f= open(filename,'r')
    for line in f:
        line.rstrip()
	line.strip()
	if(line[0] == '%' or line[0] == '\n' or len(line) == 0):
		continue
        jarr += (readline(line))
    jarr = jarr[:-2]
    jarr += '\n]'
    jarr.join(']')
    f.close()
    print jarr

def main(argl):
    inputfile = ''
    try:
        if len(argl) == 0:
            print "usage: python <script name> -i <input file>"
            sys.exit(1)
        opts, args = getopt.getopt(argl,"i:")
    except getopt.GetoptError:
        print "usage: python <script name> -i <input file>"
        sys.exit(1)
    for opt, arg in opts:
        if opt == "-i":
            try:
                readin(arg)
            except Exception as inst:
                print "Exception:", inst.args[0]

# Run main
main(args[1:])
