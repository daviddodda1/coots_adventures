import p5Types from "p5";
import { game_height, game_width } from "../constants";

export class Background {
  pos: p5Types.Vector;
  width: number;
  height: number;
  bg_img: p5Types.Image;

  constructor(
    width: number,
    height: number,
    bg_img: p5Types.Image,
    p5: p5Types
  ) {
    this.pos = p5.createVector(-game_width * 5, -game_height * 5);
    this.width = width;
    this.height = height;
    this.bg_img = bg_img;
  }

  update(p5: p5Types, playerVel: p5Types.Vector) {
    // Update the position of the platform
    this.pos.x -= playerVel.x / 7;
    this.pos.y -= playerVel.y / 7;
  }

  // Draws the platform on the canvas
  draw(p5: p5Types) {
    // Draw the platform based on the current platform type

    // draw gb for 10x10 screen
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        p5.image(
          this.bg_img,
          this.pos.x + i * this.width,
          this.pos.y + j * this.height,
          this.width,
          this.height
        );
      }
    }
  }
}
