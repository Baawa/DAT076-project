function get(method, params, success, failure) {
  $.ajax({
    url: method,
    type: 'GET',
    data: params,
    headers: {ajax:true},
    async: true,
    cache: false,
    statusCode: {
      401: function() {
        window.location = '/login';
      }
    },
    success: function (data, textStatus, xhr) {
      success(data);
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error(errorThrown);
      failure(errorThrown);
    }
  });
}

function post(method, params, success, failure) {
  // Workaround for table selections
  if (typeof checkedRows !== 'undefined' && params.constructor === Array) {
    console.log('Will append to params: ', checkedRows);
    params.push({'name':'checkedRows', 'value':JSON.stringify(checkedRows)});
  }
  // Send data
  $.ajax({
    url: method,
    type: 'POST',
    data: params,
    headers: {ajax:true},
    async: true,
    cache: false,
    statusCode: {
      401: function() {
        window.location = '/login';
      }
    },
    success: function (data, textStatus, xhr) {
       success(data);
     },
     error: function (xhr, textStatus, errorThrown) {
       console.error(errorThrown);
       failure(errorThrown);
     }
  });
}

function postParams(params, apiMethod, callback, errorLabelId) {
  if (typeof params !== 'undefined' && typeof apiMethod !== 'undefined') {
    toggleLoadingDialog(true);
    post(apiMethod,  params, function(data) {
      toggleLoadingDialog(false);
      if (typeof callback !== 'undefined') {
        if (typeof callback === 'function') {
          callback();
        } else if (typeof callback === 'string') {
          window.location = callback;
        }
      }
    }, function(error) {
      toggleLoadingDialog(false);
      if (typeof errorLabelId !== 'undefined') {
        $(errorLabelId).html(error);
      } else {
        console.error(error);
      }
    });
  } else {
    console.error('Params or API Method undefined.');
  }
}

function postData(formId, apiMethod, callback, errorLabelId) {
  if (typeof apiMethod !== 'undefined') {
    toggleLoadingDialog(true);
    var formData = new FormData($(formId)[0]);
    $.ajax({
      url: apiMethod,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST',
      success: function(data) {
        toggleLoadingDialog(false);
        if (typeof callback !== 'undefined') {
          if (typeof callback === 'function') {
            callback();
          } else if (typeof callback === 'string') {
            window.location = callback;
          }
        }
      },
      error: function(error) {
        toggleLoadingDialog(false);
        if (typeof errorLabelId !== 'undefined') {
          $(errorLabelId).html(error);
        } else {
          console.error(error);
        }
      }
    });
  } else {
    console.error('API Method undefined.');
  }
}


function getContentView(apiMethod, navTitle, errorLabelId) {
  if (typeof apiMethod !== 'undefined') {
    get(apiMethod,  null, function(data) {
      if (typeof navTitle !== 'undefined') {
        $('#navtitle').html(navTitle);
      }
      $('#content').html(data);
      $('#content').css('height','auto');
    }, function(error) {
      if (typeof errorLabelId !== 'undefined') {
        $(errorLabelId).html(error);
      } else {
        console.error(error);
      }
    });
  } else {
    console.error('API Method undefined.');
  }
  $('#overlay-close').click(); // Close mobile nav
}


function postForm(formId, apiMethod, callback, errorLabelId) {
  if (typeof formId !== 'undefined' && typeof apiMethod !== 'undefined') {
    var form = $(formId);
    //var validator = form.validate();
    if (true) { //form.valid()
      //toggleLoadingDialog(true);
      $(errorLabelId).hide();
      var params = form.serializeArray();
      post(apiMethod,  params,
      function(data) {
        //toggleLoadingDialog(false);
        if (typeof callback !== 'undefined') {
          if (typeof callback === 'function') {
            callback(data);
          } else if (typeof callback === 'string') {
            window.location = callback;
          }
        }
      },
      function(error) {
        //toggleLoadingDialog(false);
        if (typeof errorLabelId !== 'undefined') {
          $(errorLabelId).val(error);
          $(errorLabelId).show();
        } else {
          console.error(error);
        }
      });
    } else {
      if (typeof errorLabelId !== 'undefined') {
        $(errorLabelId).val('Form invalid.');
        $(errorLabelId).show();
      } else {
        console.error('Form invalid.');
      }
      //validator.focusInvalid();
    }
  } else {
    if (typeof errorLabelId !== 'undefined') {
      $(errorLabelId).val('Form/Method undefined.');
      $(errorLabelId).show();
    } else {
      console.error('Form/Method undefined.');
    }
  }
}
