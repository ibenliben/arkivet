const logo = document.getElementById("circle")
const nav = document.getElementById("navbar")

logo.addEventListener("click", () => {
    console.log("logo ble trykket")

    nav.classList.toggle("show")
}) 

/* ARTIKKEL */

const pil = document.querySelector(".fa-play")
const artikkel = document.querySelector("article")

pil.addEventListener("click", () => {
    console.log(`"vis mer"-pil ble trykket`)

    artikkel.classList.toggle("block")
    pil.classList.toggle("fa-rotate-270")
    pil.style.transition = "1s"
})

/* TIDSLINJE */

let items = document.querySelectorAll(".timeline li")

function elementInView(el) {
    let rect = el.getBoundingClientRect()

    return (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    )
}

function callBack() {
    for(let i = 0; i < items.length; i++) {
        if(elementInView(items[i])) {
            items[i].classList.add("in-view")
        }
    }
}

window.onload = callBack
window.onresize = callBack
window.onscroll = callBack