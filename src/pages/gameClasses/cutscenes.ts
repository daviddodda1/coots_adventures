import p5Types from "p5";
import { game_height, game_width } from "../constants";
import { PlatformTypes } from "./platform";

export const enum CutsceneType {
  START = "START",
  END = "END",
}

export const CutsceneConstants = {
  START: {
    frames: [0, 1, 2, 3, 4, 5, 6],
    time_between_frames: 2000,
  },
  END: {
    frames: [7, 8, 9, 10],
  },
};

export class Cutscenes {
  pos: p5Types.Vector;
  width: number;
  height: number;
  current_frame: number = 0;
  type: CutsceneType;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    cutsceneType: CutsceneType,
    p5: p5Types
  ) {
    this.pos = p5.createVector(x, y);
    this.width = width;
    this.height = height;
    this.type = cutsceneType;
  }

  nextFrame() {
    // implimenting the camera.
    this.current_frame += 1;
  }

  // Draws the platform on the canvas
  draw(
    p5: p5Types,
    cutscene_sprite_json: any,
    cutscene_sprite_img: p5Types.Image
  ) {
    // implimenting the camera.
    this.renderSprite(
      p5,
      CutsceneConstants[this.type].frames[this.current_frame],
      this.pos.x,
      this.pos.y,
      this.width,
      this.height,
      cutscene_sprite_json,
      cutscene_sprite_img
    );
  }

  renderSprite(
    p5: p5Types,
    frameNumber: number,
    x_pos: number,
    y_pos: number,
    width: number,
    height: number,
    cutscene_sprite_json: any,
    cutscene_sprite_img: p5Types.Image
  ) {
    let framePos = p5.createVector(
      cutscene_sprite_json[frameNumber].frame.x,
      cutscene_sprite_json[frameNumber].frame.y
    );
    let frameSize = p5.createVector(
      cutscene_sprite_json[frameNumber].frame.w,
      cutscene_sprite_json[frameNumber].frame.h
    );

    p5.push();
    p5.image(
      cutscene_sprite_img,
      x_pos,
      y_pos,
      width,
      height,
      framePos.x,
      framePos.y,
      frameSize.x,
      frameSize.y
    );
    p5.pop();
  }
}
