var $ = require('jquery');
var Firebase = require('firebase');

$.fn.serializeObject = function() {
  return this.serializeArray().reduce(function(acum, i) {
    acum[i.name] = i.value;
    return acum;
  }, {});
};

$(function(){
  var ref = new Firebase("https://boiling-torch-7434.firebaseio.com");
  var auth;

  $('#signup').on('submit', function(event){
    event.preventDefault();
    var $form = $(this);
    var formData = $form.serializeObject();

    ref.createUser(formData, function(error, userData) {
      if (error) {
        switch (error.code) {
          case "EMAIL_TAKEN":
            console.log("The new user account cannot be created because the email is already in use.");
            break;
          case "INVALID_EMAIL":
            console.log("The specified email is not a valid email.");
            break;
          default:
            console.log("Error creating user:", error);
        }
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
      }
    });

  });

  $('#login').on('submit', function(event){
    event.preventDefault();
    var $form = $(this);
    var formData = $form.serializeObject();

    ref.authWithPassword(formData, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        auth = authData.token;
      }
    });

  });

  $('#get-data').click(function(event){
    event.preventDefault();

    $.ajax('https://boiling-torch-7434.firebaseio.com/menu.json?auth=' + auth).then(function(data){
      console.log(data);
    });

  });

});
