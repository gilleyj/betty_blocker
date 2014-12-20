
document.addEventListener('DOMContentLoaded', function () {
  var myEl = document.getElementById('betty_block_block_button');
  myEl.addEventListener('click', function() {
    chrome.runtime.sendMessage({type: "betty_block_user_now"});
  }, false);
});

