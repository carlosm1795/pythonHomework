function consultIP(){
    var ip = document.getElementById("selectedIP").value
    if (ip != ""){
        $.ajax({
		url:"http://127.0.0.1:5000/api/",
		crossDomain: true,
		type:"POST",
		contentType:"application/json",
		data:JSON.stringify({"message":ip}),
		beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
                $('#spinner').removeClass('hidden')
         },
		success: function (data) {
                insertIntoTextArea(data);
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
            $('#spinner').addClass('hidden')
        }
	})
    }
}

function insertIntoTextArea(text){
    document.getElementById("ipInformation").value = `${text["city"]}-${text["country_name"]}-${text["ip"]}-${text["latitude"]}` ;
}

function filterIPS(){
    var ipRegex = document.getElementById("ipFilterInput").value
        if (ipRegex != ""){
            $.ajax({
            url:"http://127.0.0.1:5000/filterIPS/",
            crossDomain: true,
            type:"POST",
            contentType:"application/json",
            data:JSON.stringify({"regex":ipRegex}),
            beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
                $('#spinner').removeClass('hidden')
            },
            success: function (data) {
                    deleteRowsTableModalUpdates();
                    InsertIntoTable(data);
            },
            complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
                $('#spinner').addClass('hidden')
            }
        })
    }
}

function InsertIntoTable(data){
     for (var i=0; i < data.length; i++){
                var tbodyRef = document.getElementById('listIpFiltered').getElementsByTagName('tbody')[0];
                tr = document.createElement('tr');
                tr.appendChild(document.createElement('td'));
                tr.appendChild(document.createElement('td'));
                tr.appendChild(document.createElement('td'));
                tr.appendChild(document.createElement('td'));
                tr.appendChild(document.createElement('td'));

                var btn = document.createElement("BUTTON");
                btn.value = data[i];
                btn.id = data[i];
                btn.innerHTML = "More Information";
                var x = data[i].toString();
                btn.onclick = function() { getMoreInformation(this.id); }

                var btnRDAP = document.createElement("BUTTON");
                btnRDAP.value = data[i];
                btnRDAP.id = data[i];
                btnRDAP.innerHTML = "RDAP Info";
                var x = data[i].toString();
                btnRDAP.onclick = function() { getRDAP(this.id); }

                var exportAsCsv = document.createElement("BUTTON");
                exportAsCsv.value = data[i];
                exportAsCsv.id = data[i];
                exportAsCsv.innerHTML = "CSV";
                exportAsCsv.onclick = function() { exportCSV(this.id); }

                var exportAsJson = document.createElement("BUTTON");
                exportAsJson.value = data[i];
                exportAsJson.id = data[i];
                exportAsJson.innerHTML = "JSON";
                exportAsJson.onclick = function() { exportJSON(this.id); }

                tr.cells[0].appendChild(document.createTextNode(data[i]));
                tr.cells[1].appendChild(btn);
                tr.cells[2].appendChild(btnRDAP);
                tr.cells[3].appendChild(exportAsCsv);
                tr.cells[4].appendChild(exportAsJson);

                tbodyRef.appendChild(tr);
            }
}

function deleteRowsTableModalUpdates(){
    var tableRow = document.getElementById("listIpFiltered");
    var topTable = tableRow.rows.length-1;
    for (var i = 0 ; i< topTable;i++ ){
        tableRow.deleteRow(-1);
    }
}
detailInformationIPRDAP
function deleteRowsTableDetailInformationIP(){
    var tableRow = document.getElementById("detailInformationIP");
    var topTable = tableRow.rows.length-1;
    for (var i = 0 ; i< topTable;i++ ){
        tableRow.deleteRow(-1);
    }
}

function deleteRowsdetailInformationIPRDAP(){
    var tableRow = document.getElementById("detailInformationIPRDAP");
    var topTable = tableRow.rows.length-1;
    for (var i = 0 ; i< topTable;i++ ){
        tableRow.deleteRow(-1);
    }
}

function insertIntoDetailInformationIP(data){
    var tbodyRef = document.getElementById('detailInformationIP').getElementsByTagName('tbody')[0];
    tr = document.createElement('tr');
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));

    tr.cells[0].appendChild(document.createTextNode(data['city']));
    tr.cells[1].appendChild(document.createTextNode(data['country_code']));
    tr.cells[2].appendChild(document.createTextNode(data['country_name']));
    tr.cells[3].appendChild(document.createTextNode(data['ip']));
    tr.cells[4].appendChild(document.createTextNode(data['latitude']));
    tr.cells[5].appendChild(document.createTextNode(data['longitude']));
    tr.cells[6].appendChild(document.createTextNode(data['metro_code']));
    tr.cells[7].appendChild(document.createTextNode(data['region_code']));
    tr.cells[8].appendChild(document.createTextNode(data['region_name']));
    tr.cells[9].appendChild(document.createTextNode(data['time_zone']));
    tr.cells[10].appendChild(document.createTextNode(data['zip_code']));

    tbodyRef.appendChild(tr);
}

function insertRDAPINFO(data){
    deleteRowsdetailInformationIPRDAP();
    var tbodyRef = document.getElementById('detailInformationIPRDAP').getElementsByTagName('tbody')[0];
    tr = document.createElement('tr');
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));

    tr.cells[0].appendChild(document.createTextNode(data['ipVersion']));
    tr.cells[1].appendChild(document.createTextNode(data['startAddress']));
    tr.cells[2].appendChild(document.createTextNode(data['endAddress']));
    tr.cells[3].appendChild(document.createTextNode(data['name']));
    tr.cells[4].appendChild(document.createTextNode(data['type']));
    tbodyRef.appendChild(tr);
}

function insertRDAPINFOError(){
    deleteRowsdetailInformationIPRDAP();
    var result = "No Data Found"
    var tbodyRef = document.getElementById('detailInformationIPRDAP').getElementsByTagName('tbody')[0];
    tr = document.createElement('tr');
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));
    tr.appendChild(document.createElement('td'));

    tr.cells[0].appendChild(document.createTextNode(result));
    tr.cells[1].appendChild(document.createTextNode(result));
    tr.cells[2].appendChild(document.createTextNode(result));
    tr.cells[3].appendChild(document.createTextNode(result));
    tr.cells[4].appendChild(document.createTextNode(result));
    tbodyRef.appendChild(tr);
}

function getMoreInformation(ip){
    if (ip != ""){
        $.ajax({
		url:"http://127.0.0.1:5000/api/",
		crossDomain: true,
		type:"POST",
		contentType:"application/json",
		data:JSON.stringify({"message":ip}),
		beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
                $('#spinner').removeClass('hidden')
         },
		success: function (data) {
                deleteRowsTableDetailInformationIP();
                insertIntoDetailInformationIP(data);
        },
        error: function (request, status, error) {
            alert(request.responseText);
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
            $('#spinner').addClass('hidden')
        }
	})
    }
}

function getRDAP(ip){
    if (ip != ""){
        $.ajax({
		url:"http://127.0.0.1:5000/getRDAP/",
		crossDomain: true,
		type:"POST",
		contentType:"application/json",
		data:JSON.stringify({"ip":ip}),
		beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
                $('#spinner').removeClass('hidden')
         },
		success: function (data) {
           console.log(data);
           if (data["errorCode"] === undefined){
            insertRDAPINFO(data);
           }else{
                insertRDAPINFOError();
           }

        },
        error: function (request, status, error) {
            alert(request.responseText);
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
            $('#spinner').addClass('hidden')
        },
	})
    }
}

function exportCSV(ip){
     window.location='http://127.0.0.1:5000/download/'+ip;
}

function exportJSON(ip){
     window.location='http://127.0.0.1:5000/downloadJSON/'+ip;
}
