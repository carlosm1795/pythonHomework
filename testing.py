import xml.etree.ElementTree as gfg

dicto = {"ip": "244.36.171.60", "country_code": "123", "country_name": "USA", "region_code": "222", "region_name": "3333", "city": "444", "zip_code": "555", "time_zone": "666", "latitude": 0, "longitude": 0, "metro_code": 0}

def createXML():
    root = gfg.Element("Ip_Information")
    '''
    ip = gfg.Element('ip')
    ip.text = dicto["ip"]
    root.append(ip)

    country = gfg.Element('country')
    country.text = dicto["country_name"]
    root.append(country)
'''
    for key in dicto.keys():
        element = gfg.Element(key)
        element.text = str(dicto[key])
        root.append(element)
    tree = gfg.ElementTree(root)
    with open('Testing.xml',"wb") as files:
        tree.write(files)

createXML()
