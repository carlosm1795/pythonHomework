from flask import Flask, render_template, send_from_directory,request,jsonify,send_file
from werkzeug.utils import secure_filename
import os,re,requests,json,logging,datetime,csv

app = Flask(__name__)

global listIP
listIP = []


'''
    This function is going to add an error Log when the try except faile
    We receive RuntimeErro: String, TypeError: String, NameError: String
    return nothing
'''
def addLoginLogExcept(RuntimeError, TypeError, NameError):
    logging.getLogger(__name__).info(
        "Name Error: %s, RunTimeError: %s, TypeError: %s" % (NameError, RuntimeError, TypeError))

"""
    This function is going to calculate the actual Date and return into the following output
    DD-MONTH-YEAR hh:mm:ss
    No Inputs required
    Return outputDate in string format
"""
def getActualDate():
    date = datetime.datetime.now()
    outputDate = "{}-{}-{} {}:{}:{}".format(date.day,date.month,date.year,date.hour,date.minute,date.second)
    return outputDate

'''
    This function is going to extract all the IPS of a file.
    We receive a fileName: string:
    Return FinalList: list
'''
def extractIP(fileName):
    listip = [re.findall(r'(?:[0-9]{1,3}\.){3}[0-9]{1,3}', line) for line in open(fileName)]
    finalList = []
    for ip in listip:
        if (len(ip) > 0):
            finalList = finalList + ip
    return finalList

'''
    This function is going to consult the GEO IP information base on the IP
    We Receive an IP: string
    return a dictionary with the following keys: ip,country_code,country_name,region_code,region_name,city,zip_code,time_zone,latitude,longitude,metro_code
'''
def consult(ip):
    try:
        url = "https://freegeoip.app/json/" + ip
        payload = {}
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        response = requests.request("GET", url, headers=headers, data=json.dumps(payload))
        logging.getLogger(__name__).info("Evaluating the IP:%s at [%s]" % (ip, getActualDate()))
        answerIP = response.json()
        return answerIP

    except(RuntimeError, TypeError, NameError):
        addLoginLogExcept(RuntimeError, TypeError, NameError)

'''
def filterIPS(listIP,regex):
    ips = []
    for ip in listIP:
        aux = re.findall(regex,ip)
        if len(aux) > 0:
            ips.append(ip)
    return ips
'''

'''
    This function is going to Calculate all the RDAP information related with an IP
    Receive and IP:string
    return rdap: Dictionary, 
    with the following keys: rdapConformance,notices,handle,startAddress,endAddress,ipVersion,name,type,parentHandle,events,links,entities,port43,status,objectClassName,cidr0_cidrs,arin_originas0_originautnums
'''
def getRDAPCall(ip):
    try:
        url = "https://rdap.apnic.net/ip/" + ip
        payload = {}
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        response = requests.request("GET", url, headers=headers, data=payload)
        rdap = response.json()
        return rdap
    except(RuntimeError, TypeError, NameError):
        addLoginLogExcept(RuntimeError, TypeError, NameError)



'''
    This function is going to create a JSON file with the GEOIP information and the RDAP information
    receive a string with the IP in question
    return the JSON File Name
'''
def createJsonFile(ip):
    try:
        ipInformation = consult(ip)
        ipRDAPInformation = getRDAPCall(ip)
        ipInformation["rdapInformation"] = ipRDAPInformation
        fileName = "ExportData.json"
        with open(fileName, 'w') as outfile:
            json.dump(ipInformation, outfile)
        return fileName
    except (RuntimeError, TypeError, NameError):
        addLoginLogExcept(RuntimeError, TypeError, NameError)

'''
    This function is going to create a csv File with the GEO IP and RDAP Information
    Receive an iP address: string
    Return fileName: String
'''
def createCsv(ip):
    ipInformation = consult(ip)
    ipRDAPInformation = getRDAPCall(ip)
    fileName = "ExportData.csv"
    with open(fileName,'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["GEO IP Information"])
        writer.writerow(list(ipInformation.keys()))
        writer.writerow(list(ipInformation.values()))

        writer.writerow(["RDAP INFORMATION"])
        writer.writerow(list(ipRDAPInformation.keys()))
        writer.writerow(list(ipRDAPInformation.values()))
    return fileName

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/resetLogs/")
def resetLogs():
    with open("calc.log", 'w', newline='') as file:
        logging.getLogger(__name__).info("Reset Log Files")
    return geoIP()

@app.route("/getRDAP/", methods=["POST"])
def getRDAP():
    response=request.get_json()
    ipInformation = getRDAPCall(response["ip"])


    return jsonify(ipInformation)

@app.route("/filterIPS/", methods=["POST"])
def filterIPS():
    global listIP
    ips = []
    response = request.get_json()
    regex = response["regex"].strip()
    for ip in listIP:
        aux = re.findall('^'+regex, ip)
        if len(aux) > 0:
            ips.append(ip)
    return jsonify(ips)

@app.route("/api/",methods=["POST"])
def api():
    response=request.get_json()
    ipInformation = consult(response["message"])
    logging.getLogger(__name__).info("Processing Ip: %s" % (response["message"]))

    return jsonify(ipInformation)

@app.route("/geoIP")
def geoIP():
    return render_template("geoIP.html" )

@app.route("/downloadJSON/<ip>")
def donwload_JSON(ip):
    fileName = createJsonFile(ip)
    return send_file(fileName, as_attachment=True)

@app.route("/download/<ip>")
def donwload_file(ip):
    fileName = createCsv(ip)
    return send_file(fileName,as_attachment=True)

@app.route("/downloadLogsFiles/")
def downloadLogFiles():
    logFileName = 'calc.log'
    return send_file(logFileName, as_attachment=True)

@app.route("/process_File",methods=["GET","POST"])
def process_File():
    if request.method == 'POST':
        global listIP
        file = request.files['ipFile']
        filename = secure_filename(file.filename)
        path = os.path.join("files", filename)
        lista = extractIP(path)
        listIP = lista
        dictoIps = {"IPlist":lista,"TotalIP":len(lista)}

        logging.getLogger(__name__).info("Processing File: %s" % (filename))

        return render_template("process_File.html",ip=dictoIps)
    else:
        result = request.args.get['myfile']
    return result

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG,filename='calc.log')
    app.run(debug=True)
