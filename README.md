# pythonHomework

Description:
  On this repository you are going to find a set of python files that are going to create a website in which you can consult GeoIp and RDAP information from a txt file and the ability to
  donwload the output in csv or json fie.
  Also you are going to have a python script for testing.
  
  
 How to use:
  
  Clone the repository on your device
  Install the requirements with the command "pip install requirements.txt"
  Run the application with the command pythong main.py
  Access the web site and test the functionality
  
 
 How to test:
  Under the same repository you can run the following command: "py.test" By doing that the following test are going to run towards the site:
  
  - test_GET_GEOIP:
      This test is going to validate if the http response code is 200 and validate if we have the following keys on the http response ["city","country_code","country_name","ip","latitude","longitude","metro_code","region_name","time_zone","zip_code"]
      
  - test_GET_RDAP:
      This test is going to validate if the http response code is 200 and validate if we have the following keys on the http response ['ipVersion','startAddress','endAddress','name','type']
      
      
  
 For more information about how to use the script you can see the UserGuide.doc file on the repository.
