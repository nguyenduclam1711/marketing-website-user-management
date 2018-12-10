// import $ from "jquery";
// import Popper from "popper.js";
import bootstrap from "bootstrap";
import Typed from "typed.js";
require("../css/style.scss");

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

(function () {
  var newsletterForm = document.querySelector("#mc-embedded-subscribe-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      var email = document.querySelector("#mce-EMAIL").value.trim();
    if(email){
      e.preventDefault();
      fetch("/newsletter-signup", {
        method: 'POST',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email }) // data can be `string` or {object}!

      }).then(res => res.json())
        .then(response => {
          if (response.code === 200) {
            var img = `<img src='/media/spinner.svg' class="mx-auto d-block"/>`
            var html = `<h2 class="text-center newsletter-success-message">Danke dass du dich angemeldet hast. Bitte check deine E-Mail!</h2>`
            document.getElementById("mc-embedded-subscribe-form").innerHTML = img
            setTimeout(() => {
              console.log('%cResponse:','color:green; font-size: 16px',response.message)
              document.getElementById("mc-embedded-subscribe-form").parentElement.innerHTML = html          
            }, 3000)
          } else {
            let img = `<img src='/media/spinner.svg' class="mx-auto d-block"/>`
            let html = `<h2 class="text-center newsletter-error-message"}>Ein unerwarteter Fehler ist passiert. Versuche es später noch einmal.</h2>`
            document.getElementById("mc-embedded-subscribe-form").innerHTML = img
            setTimeout(() => {
              console.log('%cResponse:','color:red; font-size: 16px',response.message)
              document.getElementById("mc-embedded-subscribe-form").parentElement.innerHTML = html
            }, 3000)
          }
        })
        .catch(error => {
          console.error('Error:', error)
        });
      }
    })
  }
})();
//

//
// let typedCursor = new Typed('.subtitle', {
//   strings: ["Learn digital skills with us to get the most fulfilling jobs."],
//   typeSpeed: 30,
//   loop: true
// });
// console.log(typedCursor)

//nav-sticky
// const nav = document.querySelector('#headernav');
// const navTop = nav.offsetTop;
//
// function stickyNavigation() {
//   console.log('navTop = ' + navTop);
//   console.log('scrollY = ' + window.scrollY);
//
//   if (window.scrollY >= navTop) {
//     // nav offsetHeight = height of nav
//     document.body.style.paddingTop = nav.offsetHeight + 'px';
//     document.body.classList.add('fixed-nav');
//   } else {
//     document.body.style.paddingTop = 0;
//     document.body.classList.remove('fixed-nav');
//   }
// }
//
// window.addEventListener('scroll', stickyNavigation);
