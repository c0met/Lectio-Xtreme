
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {

    var version = "v1.1"
    console.log("Version of Lectio X is : " + version);
    
  });
});
