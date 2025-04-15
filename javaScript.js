let tabcontent, tablinks, tab;

tabcontent = document.getElementsByClassName("tabcontent");
tablinks = document.getElementsByClassName("tablinks");


for (i = 0; i < tablinks.length; i++) {
  tablinks[i].addEventListener("click", function(evt) { 
    tab = this.innerText.toLowerCase();
    openTab(evt, tab);
  });

}


function openTab(evt, tab) {
    // Remove active class from all tab 
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].classList.remove("active");
    }
    
    // Remove active class from all Tab Button
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
    }

    // Open selected Tab
    document.getElementById(tab).classList.add("active");
    evt.currentTarget.classList.add("active");

}

