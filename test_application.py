from main import app

def test_GET_GEOIP():
    response = app.test_client().post('/api/',json={'message':"208.107.210.112"})
    answer = response.get_json()
    expectedKeys = ["city","country_code","country_name","ip","latitude","longitude","metro_code","region_name","time_zone","zip_code"]

    assert response.status_code == 200, "Response is not 200"
    for key in expectedKeys:
        assert answer[key] != '', "{} is empty".format(key)

def test_GET_RDAP():
    response = app.test_client().post('/getRDAP/', json={'ip': "208.107.210.112"})
    answer = response.get_json()
    expectedKeys = ['ipVersion','startAddress','endAddress','name','type']
    assert response.status_code == 200, "Response is not 200"
    for key in expectedKeys:
        assert answer[key] != '', "{} is empty".format(key)