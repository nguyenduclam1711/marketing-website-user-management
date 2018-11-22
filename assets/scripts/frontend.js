// import $ from "jquery";
// import Popper from "popper.js";
import bootstrap from "bootstrap";
import Typed from "typed.js";

console.log("js file loaded");

// $(function() {
//   if (typeof Storage != "undefined") {
//     if (!sessionStorage.getItem("done")) {
//       setTimeout(function() {
//         $("#contactFormModal").modal("show");
//         sessionStorage.setItem("done", true);
//       }, 5000);
//     }
//   }
// });
//


let typedCursor = new Typed('.subtitle', {
  strings: ["Learn digital skills with us to get the most fulfilling jobs."],
  typeSpeed: 30,
  loop: true
});
console.log(typedCursor)
