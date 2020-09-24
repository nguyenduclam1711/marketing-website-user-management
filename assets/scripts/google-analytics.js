const findCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}

const googleAnalyticsdomainname = window.location.hostname;
const googleAnalyticsShowncookiename = "dciprivacy" + googleAnalyticsdomainname.replace(/\./g, "");
//actual GA tracking
// if (document.cookie.indexOf(googleAnalyticsShowncookiename) !== -1) {
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
// findCookie(googleAnalyticsShowncookiename) === "optedout" ? 
//   gtag('config', 'UA-140962410-1', { 'anonymize_ip': true }) : 
gtag('config', 'UA-140962410-1');
// }
//actual GA tracking end

const cookieButton = document.getElementById("cookiehint");
const cookieRejectButton = document.getElementById("cookieRejectButton");
if (cookieRejectButton) {
  cookieRejectButton.addEventListener("click", e => {
    e.preventDefault();
    hideCookieHint("optedout");
  });
}
if (cookieButton) {
  if (!findCookie(googleAnalyticsShowncookiename)) {
    setTimeout(function () {
      cookieButton.classList.add("shown");
    }, 500);
  }
  document.getElementById("cookieCloseButton").addEventListener("click", e => {
      e.preventDefault();
      hideCookieHint("accepted");
    });
}

const hideCookieHint = (cookieValue) => {
  const googleAnalyticsShowncookienamevalue = googleAnalyticsShowncookiename + "=" + `${cookieValue};expires=Wed, 1 Jan 2100 00:00:00 UTC;path=/`;
  document.cookie = googleAnalyticsShowncookienamevalue;
  cookieButton.classList.remove("shown");
};