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
//   let queryList = []
//   for (let i = 1; i < 8; i++){
//     const id = 'q' + i
//     const value = document.getElementById(id).value
//     if (value != '') {
//       queryList.push(value);
//     };
//   };
//   let queryString = ' ' + queryList.join(' ')

    queryString = 'SELECT * FROM property;';

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

        //        fields = ('x','y','pams_pin','municipal_code','block','lot','qualifier','prop_class','county','municipal_name','property_location','owner_name','owner_st_address','owner_city_state','owner_zip_code','land_val','imprvt_val','net_value','last_yr_tx','bldg_desc','land_desc','calc_acre','add_lots1','add_lots2','fac_name','prop_use','bldg_class','deed_book','deed_page','deed_date','yr_constr','sales_code','sale_price','dwell','comm_dwell','latitude','longitude','accuracy_score','accuracy_type','number','property_street','street','city','state','zipcode','source','summary','delivery_line_1','delivery_line_2','city_name','rdi','precision','dpv_match_code','dpv_footnotes','footnotes','zip_type','carrier_route','dpv_vacant','active','urbanization')

        var columnDefs = [
          {headerName: "X", field: "x", sortable: true, filter: "agTextColumnFilter", groupSelectsChildren: true, rowSelection: 'multiple', autoSize:true},
          {headerName: "Y", field: "y", sortable: true, filter: "agTextColumnFilter", groupSelectsChildren: true, rowSelection: 'multiple', autoSize:true},
          {headerName: "pams_pin Name", field: "pams_pin", sortable: true, filter: "agTextColumnFilter", groupSelectsChildren: true, rowSelection: 'multiple', autoSize:true},
          {headerName: "municipal_code", field: "municipal_code", sortable: true, filter: "agTextColumnFilter", groupSelectsChildren: true, rowSelection: 'multiple', autoSize:true},
            
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