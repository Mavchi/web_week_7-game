import "./styles.css";
import * as Phaser from "phaser";

let game

const gameOptions = {
    playerSpeed: 1000,
};

window.onload = () => {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#112211",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 1000,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0,
                },
            },
        },
        scene: PlayGame,
    };
    game = new Phaser.Game(gameConfig);
    window.focus()
}



class PlayGame extends Phaser.Scene {
    constructor() {
        super("Game");
        this.score = 0;
        this.pauseAction = false
        this.lastShotTime = 0
    }

    preload() {
        this.load.image("background", "/assets/background.png")

        this.load.image("player", "/assets/biplane.png");
        this.load.image("star", "/assets/star.png");
        this.load.image("plane", "/assets/enemy.png")
        this.load.image("bullet", "/assets/bullet.png")

        this.load.image('blast0', '/assets/explosion/exp1.png');
        this.load.image('blast1', '/assets/explosion/exp2.png');
        this.load.image('blast2', '/assets/explosion/exp3.png');
        this.load.image('blast3', '/assets/explosion/exp4.png');
        this.load.image('blast4', '/assets/explosion/exp5.png');
    }

    create() {
        this.background = this.add.image("0", "0", "background")
        //this.background = this.background.setDisplaySize(800, 1000)
        this.background.setScale(2.1)
        //console.log(this.background)

        this.player = this.physics.add.sprite(
            game.config.width / 2,
            game.config.height / 2,
            "player"
        );
        this.player.body.setCollideWorldBounds(true);

        this.starsGroup = this.physics.add.group({})
        this.physics.add.overlap(this.player, this.starsGroup, this.collectStar, null, this)

        this.enemyPlanesGroup = this.physics.add.group({})
        this.physics.add.overlap(this.player, this.enemyPlanesGroup, this.gameOver, null, this)

        //this.destroyedObjectsGroup = this.physics.add.group({})

        this.bulletsGroup = this.physics.add.group({})
        this.physics.add.overlap(this.bulletsGroup, this.enemyPlanesGroup, this.bulletHit, null, this)

        this.anims.create({
            key: 'explosion',
            frames: [
                { key: 'blast0' },
                { key: 'blast1' },
                { key: 'blast2' },
                { key: 'blast3' },
                { key: 'blast4' }
            ],
            frameRate: 10,
            repeat: 1
        });



        this.add.image(16, 16, "star");
        this.scoreText = this.add.text(32, 3, "0", {
            fontSize: "30px",
            fill: "#ffffff",
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.triggerTimer = this.time.addEvent({
            callback: this.addStars,
            callbackScope: this,
            delay: 1000,
            loop: true
        })

        this.triggerTimer2 = this.time.addEvent({
            callback: this.addEnemies,
            callbackScope: this,
            delay: 700,
            loop: true
        })
    }

    addStars() {
        if (this.pauseAction === true) {
            return
        }
        console.log("Adding star")
        this.starsGroup.create(Phaser.Math.Between(0, game.config.width), 0, "star")
        this.starsGroup.setVelocityY(gameOptions.playerSpeed / 6)
    }

    addEnemies() {
        if (this.pauseAction === true) {
            return
        }
        //console.log("Adding plane")
        this.enemyPlanesGroup.create(Phaser.Math.Between(0, game.config.width), 0, "plane")
        this.enemyPlanesGroup.setVelocityY(gameOptions.playerSpeed / 6)
    }

    update() {
        // handle input
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-gameOptions.playerSpeed)
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(gameOptions.playerSpeed)
        } else if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-gameOptions.playerSpeed)
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(gameOptions.playerSpeed)
        } else {
            this.player.body.setVelocityX(0)
            this.player.body.setVelocityY(0)
        }

        if (this.cursors.space.isDown) {
            let now = new Date().getTime()
            if ( now-this.lastShotTime > 1300 ) {
                this.lastShotTime = now
                this.bulletsGroup.create(this.player.x, this.player.y-this.player.height/2, "bullet")
                this.bulletsGroup.setVelocityY(-gameOptions.playerSpeed / 2)
            }
        } else {
            console.log("not shoot")
        }

        if (this.pauseAction === true) {
            this.physics.pause();
            let text = "Game Over"
            let lvlText = this.add.text(game.config.width/2-120*2.7, game.config.height/2-(1/2*50), text, {
                fontSize: "120px",
                fill: "#FF4633"
            });
            //player.anims.play("death", true);
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true)
        this.score += 1
        this.scoreText.setText(this.score)
    }

    gameOver(player, plane) {
        //console.log("overlap")
        this.pauseAction = true
        this.player.anims.play("explosion", true)
        this.triggerTimer = null
        this.triggerTimer2 = null
        //this.add.sprite(this.player.x, this.player.y, 'explosion1').play('explosion');
    }
    
    bulletHit(bullet, plane) {
        let destroy = (obj) =>  {
            console.log(obj)
            obj.disableBody(true, true)
        }

        bullet.disableBody(true, true)
        //plane.disableBody(true, true)
        plane.body.enable = false
        plane.anims.play("explosion", false)
        plane.once('animationcomplete', () => plane.disableBody(true, true))
        /*
        plane.disableBody(true, true)
        let destroyedPlane = this.add.sprite(plane.x, plane.y, 'blast0').play('explosion');
        //plane.anims.play("explosion", true )
        //this.world.moveDown(plane)
        //console.log(plane)
        setTimeout(destroyedPlane, 1000)
        */
    }
}