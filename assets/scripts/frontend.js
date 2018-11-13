import $ from "jquery";
import Popper from "popper.js";
import bootstrap from "bootstrap";

console.log("js file loaded");

$(function() {
  if (typeof Storage != "undefined") {
    if (!sessionStorage.getItem("done")) {
      setTimeout(function() {
        $("#contactFormModal").modal("show");
        sessionStorage.setItem("done", true);
      }, 5000);
    }
  }
});
//
// import Typed from "typed.js";
//
// let typedCursor = new Typed('#typed-cursor', {
//   strings: ["Learn digital skills with us to get the most fulfilling jobs."],
//   typeSpeed: 2000
// });
