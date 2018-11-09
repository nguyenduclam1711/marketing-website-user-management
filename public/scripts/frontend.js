console.log("js file loaded");

$(function() {
  if (typeof Storage != "undefined") {
    if (!localStorage.getItem("done")) {
      setTimeout(function() {
        $("#contactFormModal").modal("show");
      }, 5000);
    }
    localStorage.setItem("done", true);
  }
});
