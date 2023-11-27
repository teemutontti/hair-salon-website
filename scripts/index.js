// Hamburger menu click event
const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", () => {
    const icon = menuButton.querySelector(".material-symbols-outlined");
    const links = document.getElementById("links");
    if (icon.innerHTML == "menu") {
        icon.innerHTML = "close";
        links.style.display = "block";
    } else {
        icon.innerHTML = "menu";
        links.style.display = "none";
    }
});


