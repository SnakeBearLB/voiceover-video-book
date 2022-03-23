

const BrowserDetection = (browser, setBrowser) => {
  window.addEventListener("load", () => {
    // CHROME
    if (navigator.userAgent.indexOf("Chrome") != -1 ) {
      setBrowser("Chrome");
    }
    // FIREFOX
    else if (navigator.userAgent.indexOf("Firefox") != -1 ) {
      setBrowser("Firefox");
    }
    // INTERNET EXPLORER
    else if (navigator.userAgent.indexOf("MSIE") != -1 ) {
      setBrowser("Internet Explorer");
    }
    // EDGE
    else if (navigator.userAgent.indexOf("Edge") != -1 ) {
      setBrowser("Edge");
    }
    // SAFARI
    else if (navigator.userAgent.indexOf("Safari") != -1 ) {
      setBrowser("Safari");
    }
    // OPERA
    else if (navigator.userAgent.indexOf("Opera") != -1 ) {
      setBrowser("Opera");
    }
    // YANDEX BROWSER
    else if (navigator.userAgent.indexOf("YaBrowser") != -1 ) {
      setBrowser("YaBrowser")
    }
    // OTHERS
    else {
      setBrowser("Other")
    }
  });
}

export default BrowserDetection;