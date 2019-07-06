
document.addEventListener("DOMContentLoaded", function() {
  var endpoint_url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';
alert(endpoint_url);
  var r = new XMLHttpRequest();
  r.open("GET", endpoint_url, true);
  r.onreadystatechange = function () {
     if (r.readyState != 4 || r.status != 200) return;
      alert("Success: " + r.responseText);
    };
});
