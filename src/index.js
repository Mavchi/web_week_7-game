import "./styles.css";

import Phaser from "phaser";

let game;

window.onload = () => {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 800,
      height: 1000
    },
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: {
          y: 0
        }
      }
    },
    scene: PlayGame
  };

  game = new Phaser.Game(gameConfig);
  window.focus();
};

class PlayGame extends Phaser {
  constuctor() {
    super("PlayGame");
    this.score = 0;
  }

  preload() {
    this.load.image("player", "assets/Biploar.png");
  }

  create() {}

  update() {}
}
