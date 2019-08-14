function message(status, shake=false, id="") {
  if (shake) {
    $("#"+id).effect("shake", {direction: "right", times: 2, distance: 8}, 250);
  } 
  document.getElementById("feedback").innerHTML = status;
  $("#feedback").show().delay(2000).fadeOut();
}

function error(type) {
  $("."+type).css("border-color", "#E14448");
}

var login = function() {
  $.post({
    type: "POST",
    url: "/",
    data: {"username": $("#login-user").val(), 
           "password": $("#login-pass").val()},
    success(response){
      var status = JSON.parse(response)["status"];
      if (status === "Login successful") { location.reload(); }
      else { error("login-input"); }
    }
  });
};

var showInputRows = function(){
  inputRows = document.getElementById('inputRows')
  setMappingCard = document.getElementById('setMappingCard')
  inputRows.className=""
  setMappingCard.className="card"
}

var hideInputRows = function(){
  inputRows = document.getElementById('inputRows')
  setMappingCard = document.getElementById('setMappingCard')
  inputRows.className="hidden"
  setMappingCard.className="hidden"

}

var submitData = function() {

  var formData = new FormData();
  formData.append('file', $('#fileInput')[0].files[0]);

  var table = document.getElementById('table')
  table.innerHTML = ''
  table.className = ''
  
  document.getElementById('inputRows').className = 'spinner'
  
  
  $.post({
    type: "POST",
    url: "/upload",
    data: formData,
    processData: false,
    contentType: false,
    success(response){
      var div = document.getElementById('table');
      div.innerHTML = response
      $('#table').DataTable();

      var controls = document.getElementById('uploadControls')
      controls.className = 'hidden'
    }
  });
};

var getMapping = function() {

  var formData = new FormData();
  formData.append('file', $('#fileInput')[0].files[0]);

  
  $.post({
    type: "POST",
    url: "/mapping",
    data: formData,
    processData: false,
    contentType: false,
    success(response){
      div = document.getElementById('inputRows');
      div.innerHTML = response

    }
  });
};

const submitQuery = function() {

  const table = document.getElementById('table')
  table.innerHTML = ''
  let queryList = []
  for (let i = 1; i < 8; i++){
    const id = 'q' + i
    const value = document.getElementById(id).value
    if (value != '') {
      queryList.push(value);
    };
  };
  let queryString = ' ' + queryList.join(' ')

    queryString = 'SELECT * FROM property WHERE' + queryString + ';';

    let formData = new FormData();
    formData.append('query_string', queryString)


    let controls = document.getElementById('queryControls')
    controls.className = ''
    controls.style = ''
    controls.innerHTML = `
                  <div style="margin-right: 282px; height: 24px; border-radius: 3px; background-color: #818181;">
                    <p style="margin-left: 20px; color: #373944; height: 10px;"> Query: ` + queryString + `</p>
                  </div>`
  
    document.getElementById('gray-spacer').innerHTML = `
                  <div style="margin: 100px;margin-left: 250px;" class="loader"></div>`

    $.post({
      type: "POST",
      url: "/query",
      data: formData,
      processData: false,
      contentType: false,
      success(response){
        console.log(response)
        var columnDefs = [
          {headerName: "County", field: "county", sortable: true, filter: "agTextColumnFilter", groupSelectsChildren: true, rowSelection: 'multiple', autoSize:true},
          {headerName: "Lot", field: "lot", sortable: true, filter: "agTextColumnFilter", groupSelectsChildren: true, rowSelection: 'multiple', autoSize:true},
          {headerName: "Municipality Name", field: "municipality_name", sortable: true, filter: "agTextColumnFilter", groupSelectsChildren: true, rowSelection: 'multiple', autoSize:true},
          {headerName: "Block", field: "block", sortable: true, filter: "agTextColumnFilter", groupSelectsChildren: true, rowSelection: 'multiple', autoSize:true},
            
        ];
        
        // specify the data
        var rowData = response;
        
        // let the grid know which columns and what data to use
        var gridOptions = {
          columnDefs: columnDefs,
          rowData: rowData
        };
    
      // lookup the container we want the Grid to use
      var div = document.getElementById('gray-spacer')
      div.className = ''
      div.innerHTML = `<div id="ag-grid" style="height: 800px;width:1150px;" class="ag-theme-balham"></div>`
      var eGridDiv = document.getElementById('ag-grid');
    
      // create the grid passing in the div to use together with the columns & data we want to use
      new agGrid.Grid(eGridDiv, gridOptions);
          }   
        });
      };


$(document).ready(function() {
  

  $(document).on("click", "#login-button", login);
  $(document).keypress(function(e) {if(e.which === 13) {login();}});

  
  $(document).on("click", "#signup-button", function() {
    $.post({
      type: "POST",
      url: "/signup",
      data: {"username": $("#signup-user").val(), 
             "password": $("#signup-pass").val(), 
             "email": $("#signup-mail").val()},
      success(response) {
        var status = JSON.parse(response)["status"];
        if (status === "Signup successful") { location.reload(); }
        else { message(status, true, "signup-box"); }
      }
    });
  });

  $(document).on("click", "#save", function() {
    $.post({
      type: "POST",
      url: "/settings",
      data: {"username": $("#settings-user").val(), 
             "password": $("#settings-pass").val(), 
             "email": $("#settings-mail").val()},
      success(response){
        message(JSON.parse(response)["status"]);
      }
    });
  });
});


// Open or Close mobile & tablet menu
// https://github.com/jgthms/bulma/issues/856
$("#navbar-burger-id").click(function () {
  if($("#navbar-burger-id").hasClass("is-active")){
    $("#navbar-burger-id").removeClass("is-active");
    $("#navbar-menu-id").removeClass("is-active");
  }else {
    $("#navbar-burger-id").addClass("is-active");
    $("#navbar-menu-id").addClass("is-active");
  }
});