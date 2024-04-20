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