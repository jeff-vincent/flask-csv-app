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

var submitQuery = function() {

  var table = document.getElementById('table')
  table.innerHTML = ''
  var queryList = []

  var q1 = document.getElementById('q1').value
  if (q1){
    console.log(q1)
  }
  // var q2 = document.getElementById('q2').value
  // queryList.push(q2)
  // var q3 = document.getElementById('q3').value
  // queryList.push(q3)
  // var q4 = document.getElementById('q4').value
  // queryList.push(q4)
  // var q5 = document.getElementById('q5').value
  // queryList.push(q5)
  // var q6 = document.getElementById('q6').value
  // queryList.push(q6)
  var q7 = document.getElementById('q7').value
  if (q7){
    console.log(q1)
  }
  queryString = queryList.join()
  console.log(queryString)
  var formData = new FormData();
  formData.append('query_string', queryString)

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