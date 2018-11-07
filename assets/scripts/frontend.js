
// console.log("js file loaded");

import Popper from 'popper.js';
import bootstrap from 'bootstrap';
$(document).scroll(function() {
  if (
    $(document).scrollTop() > 1000 &&
    $("#contactModal").attr("displayed") === "false"
  ) {
    $("#contactModal").modal("show");
    $("#contactModal").attr("displayed", "true");
  }
});

// 
// import Typed from "typed.js";
//
// let typedCursor = new Typed('#typed-cursor', {
//   strings: ["Learn digital skills with us to get the most fulfilling jobs."],
//   typeSpeed: 2000
// });
