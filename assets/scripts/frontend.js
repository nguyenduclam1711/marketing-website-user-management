import $ from 'jquery';
import Popper from 'popper.js';
import bootstrap from 'bootstrap';
$(function() {
  $(document).scroll(function() {
    if (
      $(document).scrollTop() > 1000 &&
      $("#contactModal").attr("displayed") === "false"
    ) {
      $("#contactModal").modal("show");
      $("#contactModal").attr("displayed", "true");
    }
  });

  console.log("js file loaded");

  if (typeof Storage != "undefined") {
    if (!localStorage.getItem("done")) {
      setTimeout(function() {
        $("#contactFormModal").modal("show");
      }, 5000);
    }
    localStorage.setItem("done", true);
  }
});
// 
// import Typed from "typed.js";
//
// let typedCursor = new Typed('#typed-cursor', {
//   strings: ["Learn digital skills with us to get the most fulfilling jobs."],
//   typeSpeed: 2000
// });
