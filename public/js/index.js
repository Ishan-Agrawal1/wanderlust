const taxToggle = document.getElementById('switchCheckDefault');
    taxToggle.addEventListener('click', function() {
    let taxInfo = document.getElementsByClassName('tax-data');
    for(info of taxInfo){
        if(taxToggle.checked){
            info.style.display = "inline";
        } else {
            info.style.display = "none";
        }
    }
});