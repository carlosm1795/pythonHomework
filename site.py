from flask import Flask, render_template, send_from_directory,request,jsonify,send_file
from werkzeug.utils import secure_filename
import os,re,requests,json,logging,datetime

app = Flask(__name__)

global listIP
listIP = []

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
def getName():
    return 2+2

def extractIP(fileName):
    listip = [re.findall(r'(?:[0-9]{1,3}\.){3}[0-9]{1,3}', line) for line in open(fileName)]
    finalList = []
    for ip in listip:
        if (len(ip) > 0):
            finalList = finalList + ip
    return finalList

def consult(ip):
    url = "https://freegeoip.app/json/"+ip
    payload={}
    headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    response = requests.request("GET", url, headers=headers, data=json.dumps(payload))
    logging.getLogger(__name__).info("Evaluating the IP:%s at [%s]"%(ip,getActualDate()))
    answerIP = response.json()
    return answerIP

def filterIPS(listIP,regex):
    ips = []
    for ip in listIP:
        aux = re.findall(regex,ip)
        if len(aux) > 0:
            ips.append(ip)
    return ips

def getRDAPCall(ip):
    url = "https://rdap.apnic.net/ip/"+ip
    payload = {}
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    response = requests.request("GET", url, headers=headers, data=payload)
    rdap = response.json()
    return rdap

@app.route("/")
def home():
    return render_template("home.html")

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
    regex = response["regex"]
    for ip in listIP:
        aux = re.findall('^'+regex, ip)
        if len(aux) > 0:
            ips.append(ip)
    return jsonify(ips)

@app.route("/api/",methods=["POST"])
def api():
    response=request.get_json()
    ipInformation = consult(response["message"])

    return jsonify(ipInformation)

@app.route("/geoIP")
def geoIP():
    value = getName()
    return render_template("geoIP.html",value=value)

@app.route("/download")
def donwload_file():
    p = "Aguinaldos.csv"
    return send_file(p,as_attachment=True)

@app.route("/process_File",methods=["GET","POST"])
def process_File():
    if request.method == 'POST':
        global listIP
        # for secure filenames. Read the documentation.
        file = request.files['ipFile']
        filename = secure_filename(file.filename)

        # os.path.join is used so that paths work in every operating system
        path = os.path.join("files", filename)
        #file.save(path)

        # You should use os.path.join here too.
        #with open(path) as f:
        #    file_content = f.read()
        lista = extractIP(path)
        listIP = lista
        dictoIps = {"IPlist":lista,"TotalIP":len(lista)}
        return render_template("process_File.html",ip=dictoIps)


    else:
        result = request.args.get['myfile']
    return result

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG,filename='calc.log')
    app.run(debug=True)
