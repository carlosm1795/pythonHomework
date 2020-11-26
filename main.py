import re
import requests
import json
#############################################################################################
# Description:This Function is going to read a txt file and its going to extract all the ips.
# Recieve: fileName that is the txt file that we are going to process
# Return a list
#############################################################################################
def extractIP(fileName):
    listip = [re.findall(r'(?:[0-9]{1,3}\.){3}[0-9]{1,3}', line) for line in open(fileName)]
    finalList = []
    for ip in listip:
        if (len(ip) > 0):
            finalList = finalList + ip
    return finalList
'''
#############################################################################################
 Description: This function is going to receive a String that contains the IP to consult
 Receive: ip String
 Return a Dictionary with the following structure
 {
    ip
	contry_code
	country_name
	region_name
	city
	zip_code
	time_zone
	latitude
	longitude
	metro_code
 }
#############################################################################################
'''
def consult(ip):
    url = "https://freegeoip.app/json/"+ip
    payload={}
    headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    response = requests.request("GET", url, headers=headers, data=json.dumps(payload))
    answerIP = response.json()
    return answerIP


def processTxtFile(fileName):
    list_IP = extractIP(fileName)
    return list_IP

def searchIntoFile(ipToSearch,list_IP):
    results = list(filter(lambda ip: ip == ipToSearch,list_IP))
    return results

listIP = processTxtFile('ip.txt')
result = searchIntoFile('236.220.190.72',listIP)
print(result)