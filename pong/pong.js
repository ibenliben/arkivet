let retning = {
    idle: 0,
    up: 1,
    down: 2,
    left: 3,
    right: 4
}

let rounds = [5, 5, 3, 3, 2]
let colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6']

// ballen
let ball = {
    new: function (incrementedSpeed) {
        return {
            width: 18,
            height: 18,
            x: (this.canvas.width / 2) - 9,
            y: (this.canvas.height / 2) - 9,
            moveX: retning.idle,
            moveY: retning.idle,
            speed: incrementedSpeed || 7
        }
    }
}

// ai
let ai = {
    new: function (side) {
        return {
            width: 18,
            height: 180,
            x: side === 'left' ? 150 : this.canvas.width - 150,
            y: (this.canvas.height / 2) - 35,
            score: 0,
            move: retning.idle,
            speed: 8
        }
    }
}

let spill = {
    initialize: function () {
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')

        this.canvas.width = 1400
        this.canvas.height = 1000

        this.canvas.style.width = (this.canvas.width / 2) + 'px'
        this.canvas.style.height = (this.canvas.height / 2) + 'px'

        this.player = ai.new.call(this, 'left')
        this.ai = ai.new.call(this, 'right')
        this.ball = ball.new.call(this)

        this.ai.speed = 5
        this.running = this.over = false
        this.turn = this.ai
        this.timer = this.round = 0
        this.color = '#8c52ff'

        Pong.menu()
        Pong.listen()
    },

    sluttSpillMenu: function (text) {
        // canvas tekst og farge
        Pong.context.font = '45px Montserrat';
        Pong.context.fillStyle = this.color;

        // tegner rektangelet bak "trykk på en taste for å begynne"
        Pong.context.fillRect(
            Pong.canvas.width / 2 - 350,
            Pong.canvas.height / 2 - 48,
            700,
            100
        )

        // endrer canvas farge
        Pong.context.fillStyle = '#ffffff'

        // slutt spil teksr ('DU TAPTE' and 'DU VANT')
        Pong.context.fillText(text,
            Pong.canvas.width / 2,
            Pong.canvas.height / 2 + 15
        )

        setTimeout(function () {
            Pong = Object.assign({}, spill)
            Pong.initialize()
        }, 3000)
    },

    menu: function () {
        // tegner alle pong objekter
        Pong.draw()

        // endrer canvas tekst og farge
        this.context.font = '50px Montserrat';
        this.context.fillStyle = this.color;

        // tegner rektangelet bak "trykk på en taste for å begynne"
        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        )

        // endrer canvas farge
        this.context.fillStyle = '#ffffff'

        // tegner tekst
        this.context.fillText('Trykk på en taste for å begynne',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        )
    },

    // oppdaterer alle objekter
    update: function () {
        if (!this.over) {
            // ved kollisjon
            if (this.ball.x <= 0) Pong._resetTurn.call(this, this.ai, this.player)
            if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.ai)
            if (this.ball.y <= 0) this.ball.moveY = retning.down
            if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = retning.up

            if (this.player.move === retning.up) this.player.y -= this.player.speed
            else if (this.player.move === retning.down) this.player.y += this.player.speed

            // ny serve, ball går riktig vei
            // randomiserer retning
            if (Pong._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.player ? retning.left : retning.right
                this.ball.moveY = [retning.up, retning.down][Math.round(Math.random())]
                this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200
                this.turn = null
            }

            if (this.player.y <= 0) this.player.y = 0
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height)

            // beveger ball i riktig retning
            if (this.ball.moveY === retning.up) this.ball.y -= (this.ball.speed / 1.5)
            else if (this.ball.moveY === retning.down) this.ball.y += (this.ball.speed / 1.5)
            if (this.ball.moveX === retning.left) this.ball.x -= this.ball.speed
            else if (this.ball.moveX === retning.right) this.ball.x += this.ball.speed

            // aii opp og ned
            if (this.ai.y > this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === retning.right) this.ai.y -= this.ai.speed / 1.5
                else this.ai.y -= this.ai.speed / 4
            }
            if (this.ai.y < this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === retning.right) this.ai.y += this.ai.speed / 1.5
                else this.ai.y += this.ai.speed / 4
            }

            // ai kollisjon
            if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height
            else if (this.ai.y <= 0) this.ai.y = 0

            // spiller-ball kollisjon
            if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
                if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
                    this.ball.x = (this.player.x + this.ball.width)
                    this.ball.moveX = retning.right

                }
            }

            // ai-ball kollisjon
            if (this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width) {
                if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y) {
                    this.ball.x = (this.ai.x - this.ball.width)
                    this.ball.moveX = retning.left

                }
            }
        }


        // sjekker om spiller vant runden
        if (this.player.score === rounds[this.round]) {
            // sjekker om flere runde -> vinner screen
            if (!rounds[this.round + 1]) {
                this.over = true
                setTimeout(function () { Pong.sluttSpillMenu('DU VANT!') }, 1000)
            } else {
                // dersom det er en til runde 
                this.color = this._generateRoundColor()
                this.player.score = this.ai.score = 0
                this.player.speed += 0.5
                this.ai.speed += 1
                this.ball.speed += 1
                this.round += 1

            }
        }
        // om ai vant runden
        else if (this.ai.score === rounds[this.round]) {
            this.over = true
            setTimeout(function () { Pong.sluttSpillMenu('DU TAPTE!') }, 1000)
        }
    },

    // tegner objekter i canvas
    draw: function () {
        // clear canvas
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )

        // fill style til svart
        this.context.fillStyle = this.color

        // tegner bakgrunn
        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )

        // fill style til hvit for ball og paddles
        this.context.fillStyle = '#ffffff'

        // tegner spiller
        this.context.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        )

        // tegner ai
        this.context.fillRect(
            this.ai.x,
            this.ai.y,
            this.ai.width,
            this.ai.height
        )

        // tegner ball
        if (Pong._turnDelayIsOver.call(this)) {
            this.context.fillRect(
                this.ball.x,
                this.ball.y,
                this.ball.width,
                this.ball.height
            )
        }

        // tegner linjen på midten
        this.context.beginPath()
        this.context.setLineDash([7, 15])
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140)
        this.context.lineTo((this.canvas.width / 2), 140)
        this.context.lineWidth = 10
        this.context.strokeStyle = '#ffffff'
        this.context.stroke()

        // canvas - align center
        this.context.font = '100px Montserrat';
        this.context.textAlign = 'center'

        // tegner spillers score
        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width / 2) - 300,
            200
        )

        // tegner paddlenes score
        this.context.fillText(
            this.ai.score.toString(),
            (this.canvas.width / 2) + 300,
            200
        )

        // endrer font size for score tekst
        this.context.font = '30px Montserrat';

        // tegner vinner-scoren
        this.context.fillText(
            'Runde ' + (Pong.round + 1),
            (this.canvas.width / 2),
            35
        )

        // font size for scoren på midten
        this.context.font = '40px Montserrat'

        // spill rundenummer
        this.context.fillText(
            rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
            (this.canvas.width / 2),
            100
        )
    },

    loop: function () {
        Pong.update()
        Pong.draw()

        // dersom spillet er over, tegn neste
        if (!Pong.over) requestAnimationFrame(Pong.loop)
    },

    listen: function () {
        document.addEventListener('keydown', function (key) {
            // trykk taste function
            if (Pong.running === false) {
                Pong.running = true
                window.requestAnimationFrame(Pong.loop)
            }

            // håndterer up arrow og w key eventer
            if (key.keyCode === 38 || key.keyCode === 87) Pong.player.move = retning.up

            // håndterer down arrow og s key eventer
            if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = retning.down
        })

        // stopper spiller fra å bevege før taster er trykket
        document.addEventListener('keyup', function (key) { Pong.player.move = retning.idle })
    },

    // reseter ballens posisjon, spillerens tur og delay før neste runde begynner
    _resetTurn: function (victor, loser) {
        this.ball = ball.new.call(this, this.ball.speed)
        this.turn = loser
        this.timer = (new Date()).getTime()

        victor.score++
    },

    // venter på delay før hver runde
    _turnDelayIsOver: function () {
        return ((new Date()).getTime() - this.timer >= 1000)
    },

    // velger tilfelidig bakgrunnsfarge for runden
    _generateRoundColor: function () {
        let newColor = colors[Math.floor(Math.random() * colors.length)]
        if (newColor === this.color) return Pong._generateRoundColor()
        return newColor
    }
}

let Pong = Object.assign({}, spill)
Pong.initialize() 