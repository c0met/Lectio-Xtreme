function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + exdays);
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
function checkCookie(cname) {
    var name = getCookie(cname);
    if (name != "") {
        return true;
    } else {
        return false;
    }
}
function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function login() {
	var checkboxState = document.getElementById("AutoLogin").checked;
	if(checkboxState == true) {
		var uname = document.getElementById("m_Content_usernametr").lastElementChild.firstElementChild.value;
		var upass = document.getElementById("passwordHidden").value;
		var upassTemp = "save" + upass;
		upass = upassTemp.substring(4);
		if(uname != "" && upass != "") {
			upass = Base64.encode(upass);
			chrome.storage.sync.set({"uname": uname, "upass": upass}, function(){});
		}
	} else {
		resetData();
	}
}

function setALTry(state){
	setCookie("ALTry", state, 180000);
}

function resetData() {
	setALTry("true");
	chrome.storage.sync.remove(["uname", "upass"], function(){});
}

function toggle_visibility(id) {
   var e = document.getElementById(id);
   if(e.style.display == 'block')
      e.style.display = 'none';
   else
      e.style.display = 'block';
}

function toggle_table_visibility(id) {
   var e = document.getElementById(id);
   if(e.style.display == 'table-row')
      e.style.display = 'none';
   else
      e.style.display = 'table-row';
}

function failedLogin(){
	resetData();
	setALTry("none");
	toggle_table_visibility("ALFail");
}

function start() {
	var ALTry;
	if(checkCookie("ALTry") == true && getCookie("ALTry") !== "undefined"){
		if(getCookie("ALTry") == "false"){
			ALTry = false;
		} else if(getCookie("ALTry") == "none"){
			ALTry = "none";
		} else {
			ALTry = true;
		}
	} else {
		ALTry = true;
	}
	chrome.storage.sync.get(["uname", "upass"], function(data){
		if(data["uname"] !== "undefined" && data["upass"] != "undefined" && data["uname"] !== null && data["upass"] != null && ALTry == true) {
			var CookieUName = data["uname"];
			var CookieUPass = Base64.decode(data["upass"]);
			document.getElementById("m_Content_usernametr").lastElementChild.firstElementChild.value = CookieUName;
			var upass = document.getElementById("m_Content_passwordtr").lastElementChild.firstElementChild.value;
			if(upass === "undefined") {
				document.getElementById("password2").value = CookieUPass;
			} else {
				document.getElementById("m_Content_passwordtr").lastElementChild.firstElementChild.value = CookieUPass;
			}
			eventFire(document.getElementById("m_Content_submitbtn2"), "click");
			setALTry("false");
		} else if(ALTry == false) {
			failedLogin();
		}
	});
}

function insertForm(){
	document.getElementById("m_Content_passwordtr").outerHTML += '<tr id="m_Content_autologintr"><td>Auto login:</td><td><input type="checkbox" id="AutoLogin" checked /></td></tr><tr id="ALFail" style="display:none;"><td></td><td style="color: red;">Lectio AutoLogin kunne ikke logge dig ind.</td></tr>';
}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var path = window.location.pathname;
var page = path.split("/").pop();

(function() {
	if(page == "login.aspx") {
		insertForm();
		setInterval(function(){if(document.querySelector('#m_Content_autologintr') === null){insertForm();}}, 100);
		document.getElementById("m_Content_submitbtn2").addEventListener("click", function(){login();});
		document.getElementById("aspnetForm").addEventListener("keypress", function(){login();});
		document.getElementById("aspnetForm").addEventListener("submit", function(){login();});
		document.getElementById("m_Content_submitbtn2").setAttribute('onclick', 'login(); ' + document.getElementById("m_Content_submitbtn2").getAttribute("onclick"));
		start();
	} else if(document.getElementById("s_m_LoginOutLink")) {
		if(document.getElementById("s_m_LoginOutLink").innerHTML == "Log ud"){
			document.getElementById("s_m_LoginOutLink").addEventListener("click", function(){
				resetData();
			});
			setALTry("true");
		}
	}
})();