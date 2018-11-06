console.log("js file loaded");
$(document).scroll(function() {
  if (
    $(document).scrollTop() > 1000 &&
    $("#contactModal").attr("displayed") === "false"
  ) {
    $("#contactModal").modal("show");
    $("#contactModal").attr("displayed", "true");
  }
});
