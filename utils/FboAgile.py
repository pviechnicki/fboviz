import csv
import json
import requests
from datetime import datetime
from datetime import timedelta

site = 'https://api.data.gov/gsa/fbopen/v0/opps?api_key='
api_key = 'FIli9Fe9TDkVbrkhAebMij51ItmjgcOR5rxnONj8'
query = '&q=notice_type:"COMBINE" and FBO_CLASSCOD:"70"'
show_closed = '&show_closed=true'
limit = '&limit='
limit_val = 500
start = '&start='
start_val = 0
run_count = 0
targetDate = datetime.now() - timedelta(days=366)

fbo_getCount = site + api_key + query + show_closed + limit + str(0) + start + str(0)
getCount = requests.get(fbo_getCount)
getCount_Parsed = json.loads(getCount.text)
foundRows = getCount_Parsed['numFound']
##print(foundRows)
iterations = round(foundRows/limit_val) + 1
numGets = 0
numGets += 1 
##numGets tracks how many times you are requesting data.  
##Site says limit is 50 per day, but I hit no such limitation

FBO_CSV = open('C:\FBOagile\FBOtest.csv', 'w', newline = '')
##Need to create a folder called FBOagile and make it writable.
##
csvwriter = csv.writer(FBO_CSV, delimiter = '|')
csvwriter.writerow(['title', 'solicitationNumber', 'agency', 'office', 'postedDate', 'synopsis', 'url'])
while run_count <= iterations:
    fbo_output = site + api_key + query + show_closed + limit + str(limit_val) + start + str(start_val)
    ##print(fbo_output)
    ##print()
    FBO = requests.get(fbo_output)
    FBO_Parsed = json.loads(FBO.text)
    FBO_Details = FBO_Parsed['docs']
    for doc in FBO_Details:
        title = doc['title'].encode('utf-8')
        solnbr = doc['solnbr']
        agency = doc['agency']
        office = doc['office']
        postDate = datetime.strptime(doc['posted_dt'], '%Y-%m-%dT%H:%M:%SZ')
        ##desc =  doc.get('description', 'null').encode('utf-8')
        ##Removing 'synopsis'
        url = doc['listing_url'].encode('utf-8')
        if postDate >= targetDate:
            csvwriter.writerow([title,solnbr,agency,office,postDate,url])##desc,url])
    start_val += limit_val
    numGets += 1
    run_count += 1

FBO_CSV.close()

