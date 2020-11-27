function consultIP(){
    var ip = document.getElementById("selectedIP").value
    if (ip != ""){
        $.ajax({
		url:"http://127.0.0.1:5000/api/",
		crossDomain: true,
		type:"POST",
		contentType:"application/json",
		data:JSON.stringify({"message":ip}),
		success: function (data) {
                insertIntoTextArea(data);
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
            success: function (data) {
                    deleteRowsTableModalUpdates();
                    InsertIntoTable(data);
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

                tr.cells[0].appendChild(document.createTextNode(data[i]));
                tr.cells[1].appendChild(btn);
                tr.cells[2].appendChild(btnRDAP);

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

function deleteRowsTableDetailInformationIP(){
    var tableRow = document.getElementById("detailInformationIP");
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



function getMoreInformation(ip){
    if (ip != ""){
        $.ajax({
		url:"http://127.0.0.1:5000/api/",
		crossDomain: true,
		type:"POST",
		contentType:"application/json",
		data:JSON.stringify({"message":ip}),
		success: function (data) {
                deleteRowsTableDetailInformationIP();
                insertIntoDetailInformationIP(data);
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
		success: function (data) {
           console.log(data);
        }
	})
    }
}
