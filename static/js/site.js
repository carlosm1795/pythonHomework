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
                console.log(data);
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
                    console.log(data);
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
                tr.cells[0].appendChild(document.createTextNode(data[i]));
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