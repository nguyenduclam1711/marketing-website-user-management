
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


let Typed = require('./typed.min.js');

import Typed from "typed.js";

let typedCursor = new Typed('#typed-cursor', {
  strings: ["Learn digital skills with us to get the most fulfilling jobs."],
  typeSpeed: 40
});
