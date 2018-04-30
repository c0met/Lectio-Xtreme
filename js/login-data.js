var eID = document.getElementById('eID').value;
var pwd = document.getElementById('pwd').value;
var sID = document.getElementById('sID').value;

// storing input from register-form
function store() {
    localStorage.setItem('eID', eID.value);
    localStorage.setItem('pwd', pw.value);
    localStorage.setItem('sID',sID.value);
}
