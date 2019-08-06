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

const submitQuery = function() {
  var columnList = []
  $("#q1 > option").each(function() {
    columnList.push(this.value);
  });

  const table = document.getElementById('table')
  table.innerHTML = ''
  let queryList = []
  for (let i = 1; i < 12; i++){
    const id = 'q' + i
    const value = document.getElementById(id).value
    if (value != '') {
      queryList.push(value);
    };
  };
  let queryString = ' ' + queryList.join(' ')

  console.log(queryString)

  var excludeList = []
  for (let i = 1; i < 4; i++){
    const id = 'c' + i
    const value = document.getElementById(id).value
    if (value != '') {
      excludeList.push(value);
    };
  };

  if (excludeList != []) {
    includeList = []
    for (let i = 0; i < excludeList.length; i++){
      for (let ii = 0; ii < columnList.length; ii++){
        if (excludeList[i] == columnList[ii]){
          continue
        }
        else {
          includeList.push(columnList[ii])
        }
      }
    }
    includeString = includeList.join(', ');
    queryStringLimited = 'SELECT ' + includeString + ' FROM property;'

    let formData = new FormData();
    formData.append('query_string', queryStringLimited)

    let controls = document.getElementById('queryControls')
    controls.className = ''
    controls.style = ''
    controls.innerHTML = `
                  <div style="margin-bottom: 15px; border-radius: 10px; background-color: #818181; padding: 15px;">
                    <p style="color: #111111; height: 35px;"> Query: ` + queryString + ` | Excluded Columns:` + excludeString + `</p>
                  </div>`
  
    document.getElementById('table').innerHTML = `
                  <div style="margin: 100px;margin-left: 250px;" class="loader"></div>`

    $.post({
      type: "POST",
      url: "/query",
      data: formData,
      processData: false,
      contentType: false,
      success(response){
        var div = document.getElementById('table');
        div.innerHTML = response
        $('#table').DataTable();
      }
    });
  };

  var excludeString = excludeList.join(', ')

  queryString = 'SELECT * FROM property WHERE' + queryString +';'

  let formData = new FormData();
  formData.append('query_string', queryString)

  let controls = document.getElementById('queryControls')
  controls.className = ''
  controls.style = ''
  controls.innerHTML = `
                <div style="margin-bottom: 15px; border-radius: 10px; background-color: #818181; padding: 15px;">
                  <p style="color: #111111; height: 35px;"> Query: ` + queryString + ` | Excluded Columns:` + excludeString + `</p>
                </div>`

  document.getElementById('table').innerHTML = `
                <div style="margin: 100px;margin-left: 250px;" class="loader"></div>`


  console.log(queryString)

  $.post({
    type: "POST",
    url: "/query",
    data: formData,
    processData: false,
    contentType: false,
    success(response){
      var div = document.getElementById('table');
      div.innerHTML = response
      $('#table').DataTable();
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