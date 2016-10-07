# Converts csv file to json
# Props to http://stackoverflow.com/questions/19697846/python-csv-to-json

usage = "Usage: python csv2json.py csvFilename"

import csv #CSV library
import json #JSON library
import sys #to read command line args
import re #regular expressions library, for splitting lines
from pandas import DataFrame
import pandas as pd

#----------------------------------------------------------------------#
# Helper functions                                                     #
#----------------------------------------------------------------------#

#----------------------------------------------------------------------#
# Main functionality                                                   #
#----------------------------------------------------------------------#

#Check arguments for validity
if (len(sys.argv) != 2):
        sys.exit(usage)

#CSV filename should be first argument
csvFilename = sys.argv[1]
if (csvFilename.endswith('.csv') == False):
    sys.exit("Input filename should be in .csv format.")

#Formulate name for json file
jsonFilename = csvFilename.replace('.csv', '.json')
    
try:
    df = pd.read_csv(csvFilename, sep='\t')
except IOError:
    sys.exit("Error: couldn't open input file.")

#Write out to json file, using pandas DataFrame method
df.to_json(jsonFilename, orient='records')

