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

const toggleColumn = function(id){

}

const submitQuery = function() {
  var columnList = []
  $("#q1 > option").each(function() {
    columnList.push(this.value);
  });

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

        let graySpacer = document.getElementById('gray-spacer')
        graySpacer.style = ''
        graySpacer.className = ''
        graySpacer.innerHTML = ''
        //response is html, so it can go straight in the div
        var div = document.getElementById('table');
        div.innerHTML = response

        //add search field and button to columns before instantiating DataTables 
        $('table th').each( function () {
          var title = $(this).text();
          console.log(title)
          $(this).html( '<button class="btn btn-secondary btn-sm" style="margin-bottom:12px;"data-toggle="popover" onclick="showMore(this.value)">'+title+'</button><input type="text" placeholder="Search '+title+'" />' );
      } );
        //instantiate table
        var table = $('#table').DataTable( {
          //access dom node for hide/show buttons
          "dom": '<"toolbar">frtip',
          "width": "80%",
          "scrollX": true,
          "buttons": [
            {
                "extend": 'columnVisibility',
                "text": 'Show all',
                "visibility": true
            },
            {
                "extend": 'columnVisibility',
                "text": 'Hide all',
                "visibility": false
            }
        ]
    
        });
        //iterate over columns and add search functionality
        table.columns().every( function () {
          var that = this;
   
          $( 'input', this.header() ).on( 'keyup change clear', function () {
              if ( that.search() !== this.value ) {
                  that
                      .search( this.value )
                      .draw();
              }
          } );

          function toggleColumn(id){
            table.column()
          }   
        });
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