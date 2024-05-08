const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// lager paddlene
const user = {
    x: 0,
    y: (canvas.height/2 - 100)/2,
    width: 10,
    height: 100,
    score: 0,
    color: "white"
}

const ai = {
    x: canvas.width - 10,
    y: (canvas.height/2 - 100)/2,
    width: 10,
    height: 100,
    score: 0,
    color: "white"
}

// lage ball
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    vX: 5,
    vY: 5,
    color: "white"
}

//lager nettet
const net = {
    x: (canvas.width - 2)/2,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
}

// tegner rektangel, til paddlene
function tegnRect(x, y, w, h, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h)
}

// tegner sirkel, ballen
function tegnBall(x, y, r, color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI*2, true)
    ctx.closePath()
    ctx.fill()
}

// beveg user paddle
canvas.addEventListener("mousemove", bevegPaddle)

function bevegPaddle(evt) {
    let rect = canvas.getBoundingClientRect()

    user.y = evt.clientY - rect.top - user.height/2
}

function resetBall() {
    ball.x = canvas.width/2
    ball.y = canvas.height/2

    ball.speed = 5
    ball.vX = -ball.vX
}

//tegner nettet
function tegnNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        tegnRect(net.x, net.y + i, net.width, net.height, net.color)
    }
}

function tegnTekst(text, x, y) {
    ctx.fillStyle = "white"
    ctx.font = "45px Montserrat"
    ctx.fillText(text, x, y)
}

// oppdager kollisjon 
function kollisjon(b, s) {
    s.top = s.y 
    s.bottom = s.y + s.height
    s.left = s.x
    s.right = s.x + s.width

    b.top = b.y - b.radius
    b.bottom = b.y + b.radius
    b.left = b.x - b.radius
    b.right = b.x + b.radius

    return b.right > s.left && b.bottom > s.top && b.left < s.right && b.top < s.bottom
}

// oppdaterer ballens posisjon, bevegelse, score...
function update() {
    //oppdaterer score
    if(ball.x - ball.radius < 0) {
        ai.score++
        //aiScore.play()
        resetBall()
    } else if(ball.x + ball.radius > canvas.width) {
        user.score++
        //userScore.play()
        resetBall()
    }

    ball.x += ball.vX
    ball.y += ball.vY

    //ai som man kan spille mot
    ai.y += (ball.y - (ai.y + ai.height/2)) * 0.1

    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.vY = -ball.vY
        //vegg.play()
    }

    let spiller = (ball.x + ball.radius < canvas.width/2)? user : ai

    if(kollisjon(ball, spiller)) {
        // hvor ballen treffer spillerens paddle
        let kollisjonsPunkt = ball.y - (spiller.y + spiller.height/2)

        kollisjonsPunkt = kollisjonsPunkt/(spiller.height/2)

        //vinkel for der ballen treffer paddle
        let vinkelRad = kollisjonsPunkt * Math.PI/4
        //retning
        let retning = (ball.x + ball.radius < canvas.width/2)? 1 : -1
        // endrer fart
        ball.vX = retning * ball.speed * Math.cos(vinkelRad)
        ball.vY = ball.speed * Math.sin(vinkelRad)

        ball.speed += 0.4
    }
}


function render() {
    // canvas 
    tegnRect(0, 0, canvas.width, canvas.height, "black")

    //tegner score
    tegnTekst(user.score, canvas.width/4, canvas.height/5, "white")
    tegnTekst(ai.score, 3*canvas.width/4, canvas.height/5, "white")

    tegnNet()

    //tegner user og ai paddlene
    tegnRect(user.x, user.y, user.width, user.height, user.color)
    tegnRect(ai.x, ai.y, ai.width, ai.height, ai.color)

    //tegner ballen
    tegnBall(ball.x, ball.y, ball.radius, ball.color)
}

function spill() {
    update()
    render()
}
// loop
const framePerSecond = 50
setInterval(spill, 1000/framePerSecond)

