const express = require("express");
const router = express.Router();
const i18n = require("i18n");

router.all(/^\/(\w{2}\/)+(.*)/, handleLangUrl);

function handleLangUrl(req, res, next) {
  var lang = req.params[0].slice(0, 2);

  
  if (lang === i18n.getLocales()[0] || req.path.indexOf('users') !== -1 || req.path.indexOf('admin') !== -1) {
      console.log('handleLangUrl => locals ==> if', req.locals)
    delete req.cookies.locale
    
     res.redirect(`/${req.params[1]}`);
    
  } else {
     console.log('handleLangUrl => lang ==> else', lang)
    req.session.locale = lang
    var type = req.params[1];
    req.url = req.url.replace(lang + "/", "");
   // res.setLocale('de');
    if (type !== 'javascript' && type !== 'img' && type !== 'css') {
      i18n.setLocale(lang.slice(0, 2));
    }
    next();
  }
}

router.get("/i18n/:locale", changeLang);

function changeLang(req, res, next) {


  if (req.headers.referer) {
    if (req.params.locale === i18n.getLocales()[0]) {
        console.log('/i18n/:locale if ==> ', req.params)
        console.log('i18n.getLocales() if ==> ', i18n.getLocales())
        console.log('req.locals if ==> ', req.locals)
     
      const pathWithLocale = req.headers.referer.replace(/\/\w{2}\//, "/")
        console.log('pathWithLocale ', pathWithLocale)
        delete req.session.locale
     //   i18n.setLocale(res,'en',true)
    
      res.redirect(pathWithLocale);
    } else {
         console.log('/i18n/:locale else ==> ', req.params)
         console.log('i18n.getLocales() else ==> ', i18n.getLocales())
      req.session.locale = req.params.locale;
      const pathWithLocale = req.headers.referer.split(req.headers.host)[0] + req.headers.host + "/" + req.params.locale + req.headers.referer.split(req.headers.host)[1]
      res.redirect(pathWithLocale);
    }
  } else res.redirect("/");
}

router.get(/^[^.]*$/, setUrlIfSession);
function setUrlIfSession(req, res, next) {
  if (req.session.locale && req.path.indexOf('users') === -1 && req.path.indexOf('admin') === -1) {
    res.setLocale(req.session.locale);
    if (req.originalUrl.indexOf(req.session.locale + "/") === -1) {
      res.redirect("/" + req.session.locale + req.originalUrl);
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = router;
