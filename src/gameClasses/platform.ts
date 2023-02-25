import p5Types from "p5";
import { game_height, game_width } from "../constants";

export const enum PlatformTypes {
  NORMAL = "NORMAL",
  SLIPPERY = "SLIPPERY",
  BRICK = "BRICK",
  WALL_B = "WALL_B",
  WALL_L = "WALL_L",
  WALL_R = "WALL_R",
}

const PlatfromConstants = {
  NORMAL: {
    tiles: [1, 2, 3],
    min_platform_width: 150,
    platform_height: 60,
  },
  SLIPPERY: {
    tile_width: 120,
    tile_height: 180,
    tiles: [4, 5, 6],
    min_platform_width: 150,
    platform_height: 60,
  },
  BRICK: {
    tile_width: 180,
    tile_height: 120,
    tiles: [0],
    tile_rotation: [0],
  },
  WALL_B: {
    tile_width: 360,
    tile_height: 60,
    tiles: [7],
    tile_rotation: [90, 270],
  },
  WALL_L: {
    tile_width: 60,
    tile_height: 360,
    tiles: [8],
    tile_rotation: [90, 270],
  },
  WALL_R: {
    tile_width: 60,
    tile_height: 360,
    tiles: [9],
    tile_rotation: [90, 270],
  },
};

export default class Platform {
  pos: p5Types.Vector;
  width: number;
  height: number;
  soppyness: number;
  type: PlatformTypes;
  //   platform_sprite_json: any;
  //   platform_sprite_img: p5Types.Image;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    platformType: PlatformTypes,
    p5: p5Types
  ) {
    this.pos = p5.createVector(x, y);
    this.width = platformType == PlatformTypes.BRICK ? 24 * 3 : width;
    this.height = platformType == PlatformTypes.BRICK ? 24 * 2 : height;
    this.type = platformType;
    // this.platform_sprite_json = platform_sprite_json;
    // this.platform_sprite_img = platform_sprite_img;
    if (platformType == PlatformTypes.SLIPPERY) {
      this.soppyness = 1;
    } else {
      this.soppyness = 0.4;
    }
  }

  // Draws the platform on the canvas
  draw(
    p5: p5Types,
    platform_sprite_json: any,
    platform_sprite_img: p5Types.Image
  ) {
    // implimenting the camera.

    // Draw the platform based on the current platform type
    switch (this.type) {
      case PlatformTypes.NORMAL:
        this.renderNormalPlatform(
          p5,
          platform_sprite_json,
          platform_sprite_img
        );
        break;
      case PlatformTypes.SLIPPERY:
        this.renderSlipperyPlatform(
          p5,
          platform_sprite_json,
          platform_sprite_img
        );
        break;
      case PlatformTypes.WALL_B:
        this.renderBottomWall(p5, platform_sprite_json, platform_sprite_img);
        break;
      case PlatformTypes.WALL_L:
        this.renderLeftWall(p5, platform_sprite_json, platform_sprite_img);
        break;
      case PlatformTypes.WALL_R:
        this.renderRightWall(p5, platform_sprite_json, platform_sprite_img);
        break;
      case PlatformTypes.BRICK:
        this.renderBrick(p5, platform_sprite_json, platform_sprite_img);
        break;
    }
  }

  renderNormalPlatform(
    p5: p5Types,
    platform_sprite_json: any,
    platform_sprite_img: p5Types.Image
  ) {
    // render platform starting
    this.renderFrame(
      p5,
      PlatfromConstants.NORMAL.tiles[0],
      this.pos.x,
      this.pos.y,
      24,
      this.height,
      platform_sprite_json,
      platform_sprite_img
    );

    // render platform middle
    const number_of_middle_tiles = Math.ceil((this.width - 24 * 2) / 24);

    for (let i = 1; i <= number_of_middle_tiles; i++) {
      this.renderFrame(
        p5,
        PlatfromConstants.NORMAL.tiles[1],
        this.pos.x + 24 * i,
        this.pos.y,
        24,
        this.height,
        platform_sprite_json,
        platform_sprite_img
      );
    }

    // render platform ending
    this.renderFrame(
      p5,
      PlatfromConstants.NORMAL.tiles[2],
      this.pos.x + this.width - 24,
      this.pos.y,
      24,
      this.height,
      platform_sprite_json,
      platform_sprite_img
    );
  }

  renderSlipperyPlatform(
    p5: p5Types,
    platform_sprite_json: any,
    platform_sprite_img: p5Types.Image
  ) {
    // render platform starting
    this.renderFrame(
      p5,
      PlatfromConstants.SLIPPERY.tiles[0],
      this.pos.x,
      this.pos.y,
      24,
      this.height,
      platform_sprite_json,
      platform_sprite_img
    );

    // render platform middle
    const number_of_middle_tiles = Math.ceil((this.width - 24 * 2) / 24);

    for (let i = 1; i <= number_of_middle_tiles; i++) {
      this.renderFrame(
        p5,
        PlatfromConstants.SLIPPERY.tiles[1],
        this.pos.x + 24 * i,
        this.pos.y,
        24,
        this.height,
        platform_sprite_json,
        platform_sprite_img
      );
    }

    // render platform ending
    this.renderFrame(
      p5,
      PlatfromConstants.SLIPPERY.tiles[2],
      this.pos.x + this.width - 24,
      this.pos.y,
      24,
      this.height,
      platform_sprite_json,
      platform_sprite_img
    );
  }

  renderBottomWall(
    p5: p5Types,
    platform_sprite_json: any,
    platform_sprite_img: p5Types.Image
  ) {
    const number_of_wall_tiles = Math.ceil(this.width / 120);

    for (let i = 0; i <= number_of_wall_tiles; i++) {
      this.renderFrame(
        p5,
        PlatfromConstants.WALL_B.tiles[0],
        this.pos.x + 120 * i,
        this.pos.y,
        this.pos.x + 120 * i + 120 > this.pos.x + this.width
          ? this.pos.x + this.width - this.pos.x - 120 * i
          : 120,
        this.height,
        platform_sprite_json,
        platform_sprite_img,
        this.pos.x + 120 * i + 120 > this.pos.x + this.width
          ? Math.abs(this.pos.x + this.width - this.pos.x - 120 * i) / 120
          : 1
      );
    }
  }

  renderLeftWall(
    p5: p5Types,
    platform_sprite_json: any,
    platform_sprite_img: p5Types.Image
  ) {
    const number_of_wall_tiles = Math.ceil(this.height / 120);

    for (let i = 0; i <= number_of_wall_tiles; i++) {
      this.renderFrame(
        p5,
        PlatfromConstants.WALL_L.tiles[0],
        this.pos.x,
        this.pos.y + 120 * i,
        this.width,
        this.pos.y + 120 * i + 120 > this.pos.y + this.height
          ? this.pos.y + this.height - this.pos.y - 120 * i == 0
            ? 120
            : this.pos.y + this.height - this.pos.y - 120 * i
          : 120,
        platform_sprite_json,
        platform_sprite_img,
        1,
        this.pos.y + 120 * i + 120 > this.pos.y + this.height
          ? Math.abs(this.pos.y + this.height - this.pos.y - 120 * i) / 120 == 0
            ? 1
            : Math.abs(this.pos.y + this.height - this.pos.y - 120 * i) / 120
          : 1
      );
    }
  }

  renderRightWall(
    p5: p5Types,
    platform_sprite_json: any,
    platform_sprite_img: p5Types.Image
  ) {
    const number_of_wall_tiles = Math.ceil(this.height / 120);

    for (let i = 0; i <= number_of_wall_tiles; i++) {
      this.renderFrame(
        p5,
        PlatfromConstants.WALL_R.tiles[0],
        this.pos.x + this.width,
        this.pos.y + 120 * i,
        -this.width,
        this.pos.y + 120 * i + 120 > this.pos.y + this.height
          ? this.pos.y + this.height - this.pos.y - 120 * i == 0
            ? 120
            : this.pos.y + this.height - this.pos.y - 120 * i
          : 120,
        platform_sprite_json,
        platform_sprite_img,
        1,
        this.pos.y + 120 * i + 120 > this.pos.y + this.height
          ? Math.abs(this.pos.y + this.height - this.pos.y - 120 * i) / 120 == 0
            ? 1
            : Math.abs(this.pos.y + this.height - this.pos.y - 120 * i) / 120
          : 1
      );
    }
  }

  renderBrick(
    p5: p5Types,
    platform_sprite_json: any,
    platform_sprite_img: p5Types.Image
  ) {
    // render brick
    this.renderFrame(
      p5,
      PlatfromConstants.BRICK.tiles[0],
      this.pos.x,
      this.pos.y,
      this.width,
      this.height,
      platform_sprite_json,
      platform_sprite_img,
      1,
      1,
      true
    );
  }

  renderFrame(
    p5: p5Types,
    frameNumber: number,
    x_pos: number,
    y_pos: number,
    width: number,
    height: number,
    platform_sprite_json: any,
    platform_sprite_img: p5Types.Image,
    x_crop_fraction: number = 1,
    y_crop_fraction: number = 1,
    isBrick: boolean = false
  ) {
    let framePos = p5.createVector(
      platform_sprite_json[frameNumber].frame.x,
      platform_sprite_json[frameNumber].frame.y
    );
    let frameSize = p5.createVector(
      platform_sprite_json[frameNumber].frame.w,
      platform_sprite_json[frameNumber].frame.h
    );

    p5.push();

    p5.image(
      platform_sprite_img,
      x_pos,
      y_pos,
      width,
      height,
      framePos.x,
      framePos.y,
      frameSize.x * x_crop_fraction,
      frameSize.y * y_crop_fraction
    );
    p5.pop();
  }
}
