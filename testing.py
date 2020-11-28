import requests,json

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

information = consult("8.8.8.8")
print(information["ip"])