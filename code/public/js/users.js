$(document).ready(function(){
  
  // validation on the regisstraion form for the users
  $('#registration').submit(function(e) {
    e.preventDefault();
    var name = $('#name').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var phone = $('#phone').val();
    var cv = $('#cv').val();

    var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var phoneRgex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    var valid = true;
 
    $(".error").remove();
 
    // validate the name
    if(name.length < 1){
      $('#name').after('<span class="error">This field is required</span>');
      valid = false;
    }
    if (password.length < 3) {
      $('#password').after('<span class="error">Password must be at least 3 characters long</span>');
      valid = false;
    }
    // validate the phone number
    if(phone.length !== 0 ){
      if(!phoneRgex.test(phone)){
        $('#phone').after('<span class="error">Enter a valid number</span>');
        valid = false;
      }
    }
    //validate the cv
    if(!cv){
      $('#cv').after('<span class="error">you must upload your CV as pdf</span>');
      valid = false;
    }else if(!cv_validate(cv)){
      $('#cv').after('<span class="error">this file is not valid [ just pdf allowed ]</span>');
      valid = false;
    }
    // validate the email
    if (email.length < 1) {
      $('#email').after('<span class="error">This field is required</span>');
      valid = false;
    }else if(!regEx.test(email)){ // email is not validated
        $('#email').after('<span class="error">Enter a valid email</span>');
        valid = false;
    }

    // send a request to check if the email exists or not
    $.ajax({
      type:'POST',
      url:'/api/users/checkEmail',
      data:{email: email},
      success:(data) => {
        if(data){
          $('#email').after(`<span class="error">${data}</span>`);
          valid = false;
        
        }
        
        if(valid){
          this.submit();
        }
      },
    });
   
  });


  // validation on the signin form for the users and hrs
  $('#signin').submit(function(e) {
    
    var email = $('#email').val();
    var password = $('#password').val();
    
    var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var valid = true;
 
    $(".error").remove();
 
    // validate the email
    if (email.length < 1) {
      $('#email').after('<span class="error">email is required</span>');
      valid = false;
    }else if(!regEx.test(email)){ // email is not validated
        $('#email').after('<span class="error">Enter a valid email</span>');
        valid = false;
    }
    // validate the password
    if (password.length < 1) {
      $('#password').after('<span class="error">Password is required</span>');
      valid = false;
    }
    
    // if the form are not validated 
    if(!valid){
      e.preventDefault();
    }
    

  });

    
    // validation on the regisstraion form for the hrs
    $('#hrRegistration').submit(function(e) {
    
      var name = $('#name').val();
      var email = $('#email').val();
      var password = $('#password').val();
      
      var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var valid = true;
    
      $(".error").remove();
    
      // validate the name
      if(name.length < 1){
        $('#name').after('<span class="error">This field is required</span>');
        valid = false;
      }
      // validate the email
      if (email.length < 1) {
        $('#email').after('<span class="error">This field is required</span>');
        valid = false;
      }else if(!regEx.test(email)){ // email is not validated
          $('#email').after('<span class="error">Enter a valid email</span>');
          valid = false;
      }
      if (password.length < 3) {
        $('#password').after('<span class="error">Password must be at least 3 characters long</span>');
        valid = false;
      }
      
      // if the form are not validated 
      if(!valid){
        e.preventDefault();
      }
      
    
    });
  


});


function cv_validate(cvName) {
  var _validFileExtensions = ['pdf'];    

  if (cvName.length > 0) {
      var valid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
          var ext = _validFileExtensions[j];
          if (cvName.substr(cvName.length - ext.length, ext.length).toLowerCase() == ext.toLowerCase()) {
              valid = true;
              break;
          }
      }
      
      if (valid) 
        return true;
  
      return false;
    }
}


