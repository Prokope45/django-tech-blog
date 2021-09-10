var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}
ready(() => {
    document.querySelector(".header").style.height = window.innerHeight + "px";
})
const alert = document.querySelector("#alert-timer");
const bsAlert = new bootstrap.Alert(alert);
setTimeout(() => {
  bsAlert.close();
}, 5000);