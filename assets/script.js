document.getElementById("search").addEventListener('click', function(e){
    document.getElementById('res').innerHTML = "<h1>Loading...</h1>";
});

document.getElementById("dropdown").addEventListener('change', function(e) {
    const value = document.getElementById("dropdown").value;
    const urlInput = document.getElementsByName('url')[0];
    if (!value || value == "NULL") {
        urlInput.value = "";
    } else {
        urlInput.value = value;
    }
});