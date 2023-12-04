const carousel = document.querySelector(".carousel");
const next = carousel.querySelector(".next")
const prev = carousel.querySelector(".prev")
const images = carousel.querySelector(".images");

next.addEventListener("click", handleNext)
prev.addEventListener("click", handlePrev)

const galleryImageCount = 6;

let imageIndex = 0;

function setUp() {
    imageIndex === 0 ? prev.classList.add("disabled") : prev.classList.remove("disabled");
    imageIndex === galleryImageCount-1 ? next.classList.add("disabled") : next.classList.remove("disabled");

    const imgElements = images.children;
    for (let i=0; i<imgElements.length; i++) {
        if (i >= imageIndex && i < imageIndex+3 ) {
            imgElements[i].classList.add("shown");
        } else {
            imgElements[i].classList.remove("shown")
        }
        imgElements[i].addEventListener("mouseenter", (e) => {
            e.target.style.animation = "zoom-in 0.2s ease-in-out";
            e.target.style.transform = "scale(101%)";
        })
        imgElements[i].addEventListener("mouseleave", (e) => {
            e.target.style.animation = "zoom-out 0.2s ease-in-out";
            e.target.style.transform = "scale(100%)";
        })
    }
}
function handleNext() {
    if (imageIndex+1 !== galleryImageCount) {
        imageIndex += 1;
        setUp();
    }
}
function handlePrev() {
    if (imageIndex-1 !== -3) {
        imageIndex -= 1;
        setUp();
    }
}

setUp()