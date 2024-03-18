// Hamburger menu click event
const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", () => {
    const icon = menuButton.querySelector(".material-symbols-outlined");
    const links = document.getElementById("nav-links");
    if (icon.innerHTML == "menu") {
        icon.innerHTML = "close";
        links.style.display = "flex";
    } else {
        icon.innerHTML = "menu";
        links.style.display = "none";
    }
});

document.addEventListener("scroll", () => {
    if (window.scrollY > 650) {
        document.querySelector(".nav-link.book-link").style.display = "block";
    } else {
        document.querySelector(".nav-link.book-link").style.display = "none";
    }
})
