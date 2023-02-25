import p5Types from "p5";
import { game_height, game_width } from "../constants";
import { Platform, PlatformTypes } from "./platform";

enum PlayerAnimationState {
  IDLE = "IDLE",
  WALKING = "WALKING",
  JUMPING = "JUMPING",
  FALLING = "FALLING",
  SLIPPING = "SLIPPING",
}

const animation_sequesnces = [
  // IDLE:
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  // WALKING:
  [16, 17, 19, 20, 21, 23, 16],
];

export class Player {
  pos: p5Types.Vector;
  vel: p5Types.Vector;
  acc: p5Types.Vector;
  width: number;
  height: number;
  jumpPower: number;
  isGrounded: boolean;
  PlayerAnimationState: PlayerAnimationState;
  lastXDirection: number;
  currentFriction: number;
  cat_sprite_img: any;
  cat_sprite_json: any;
  player_animation_frame: number = 0;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    p5: p5Types,
    playerSprite: any,
    playerSpriteJson: any
  ) {
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0.7);
    this.width = width;
    this.height = height;
    this.jumpPower = 15;
    this.isGrounded = false;
    this.lastXDirection = 0;
    this.PlayerAnimationState = PlayerAnimationState.IDLE;
    this.currentFriction = 1;
    this.cat_sprite_img = playerSprite;
    this.cat_sprite_json = playerSpriteJson;
  }

  // Updates the player's position and velocity based on input and collisions
  update(p5: p5Types, platforms: Platform[]) {
    this.applyGravity();
    this.handleInput(p5);
    this.handleCollisions(p5, platforms);
    this.pos.add(this.vel);
  }

  // Applies gravity to the player's velocity
  applyGravity() {
    if (!this.isGrounded) {
      this.vel.add(this.acc);
    }
  }

  // Handles player input to move left, move right, or jump
  handleInput(p5: p5Types) {
    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      this.vel.x = -5;
      this.lastXDirection = -1;
      if (this.isGrounded)
        // this.PlayerAnimationState = PlayerAnimationState.WALKING;
        this.setAnimationState(PlayerAnimationState.WALKING);
    } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      this.vel.x = 5;
      this.lastXDirection = 1;
      if (this.isGrounded)
        // this.PlayerAnimationState = PlayerAnimationState.WALKING;
        this.setAnimationState(PlayerAnimationState.WALKING);
    }

    if (this.isGrounded) {
      this.vel.x *= this.currentFriction;
      this.setAnimationState(
        this.vel.x > 0.5 || this.vel.x < -0.5
          ? PlayerAnimationState.WALKING
          : this.currentFriction > 0.5
          ? PlayerAnimationState.SLIPPING
          : PlayerAnimationState.IDLE
      );
    }

    if (p5.keyIsDown(p5.UP_ARROW) && this.isGrounded) {
      this.vel.y = -this.jumpPower;
      this.isGrounded = false;
      // this.PlayerAnimationState = PlayerAnimationState.JUMPING;
      this.setAnimationState(PlayerAnimationState.JUMPING);
    }

    // FLY for testing
    // if (p5.keyIsDown(p5.DOWN_ARROW)) {
    //   // FLY
    //   this.vel.y = -this.jumpPower;
    // }
  }

  // Handles collisions between the player and platforms
  handleCollisions(p5: p5Types, platforms: Platform[]) {
    let playerOnPlatform = false;
    for (const element of platforms) {
      let p = element;
      // if (p.type == PlatformTypes.WALL_R) {
      //   console.log(this.pos.y + this.height < p.pos.y + p.height);
      // }

      if (this.collidesWith(p)) {
        if (
          this.vel.y > 0 &&
          this.pos.y + this.height < p.pos.y + p.height &&
          this.pos.x + this.width > p.pos.x &&
          this.pos.x < p.pos.x + p.width
        ) {
          // Player is landing on top of a platform
          this.pos.y = p.pos.y - this.height;
          this.vel.y = 0;

          this.currentFriction = p.soppyness;

          this.isGrounded = true;
          playerOnPlatform = true;
        } else if (
          this.vel.y < 0 &&
          this.pos.y > p.pos.y &&
          this.pos.y < p.pos.y + p.height
        ) {
          // Player is hitting a platform from below
          this.pos.y = p.pos.y + p.height;
          this.vel.y = 0;
        } else if (
          this.vel.x > 0 &&
          this.pos.x + this.width < p.pos.x + p.width
        ) {
          // Player is hitting a platform from the left
          this.pos.x = p.pos.x - this.width;
          this.vel.x = 0;
        } else if (this.vel.x < 0 && this.pos.x < p.pos.x + p.width) {
          // Player is hitting a platform from the right
          this.pos.x = p.pos.x + p.width;
          this.vel.x = 0;
        }
      }
    }
    if (!playerOnPlatform) {
      this.isGrounded = false;
      // this.PlayerAnimationState =
      //   this.vel.y <= 0
      //     ? PlayerAnimationState.FALLING
      //     : this.PlayerAnimationState;
    }

    // prevent player from going off screen
    if (this.pos.x < 55) {
      this.pos.x = 55;
      this.vel.x = 0;
    } else if (this.pos.x + this.width > 1265) {
      this.pos.x = 1265 - this.width;
      this.vel.x = 0;
    }
  }

  // Checks if the player collides with a platform
  collidesWith(platform: Platform) {
    return (
      this.pos.x + this.width > platform.pos.x &&
      this.pos.x < platform.pos.x + platform.width &&
      this.pos.y + this.height > platform.pos.y &&
      this.pos.y < platform.pos.y + platform.height
    );
  }

  // Draws the player on the canvas
  draw(p5: p5Types) {
    // Draw the player based on the current animation state
    switch (this.PlayerAnimationState) {
      case PlayerAnimationState.IDLE:
        this.animate(p5, 0);
        break;
      case PlayerAnimationState.WALKING:
        if (this.currentFriction > 0.5) {
          this.vel.x > 0
            ? this.animate(p5, 1, false, 2)
            : this.animate(p5, 1, true, 2);

          break;
        }
        if (this.vel.x > 0) {
          // this.renderFrame(p5, 28);
          this.animate(p5, 1);
          break;
        } else {
          // this.renderFrame(p5, 28, true);
          this.animate(p5, 1, true);
          break;
        }
      case PlayerAnimationState.JUMPING:
        if (this.vel.y < 0) {
          this.vel.x > 0
            ? this.renderFrame(p5, 44)
            : this.renderFrame(p5, 44, true);
          break;
        } else {
          this.vel.x > 0
            ? this.renderFrame(p5, 45)
            : this.renderFrame(p5, 45, true);
          break;
        }
      case PlayerAnimationState.SLIPPING:
        this.vel.x > 0
          ? this.renderFrame(p5, 53)
          : this.renderFrame(p5, 54, true);
        break;
    }
  }

  setAnimationState(state: PlayerAnimationState) {
    if (this.PlayerAnimationState === state) return;
    this.player_animation_frame = 0;
    this.PlayerAnimationState = state;
  }

  animate(
    p5: p5Types,
    animationNumber: number,
    flip: boolean = false,
    fps: number = 5
  ) {
    if (p5.frameCount % fps === 0) {
      if (
        this.player_animation_frame <
        animation_sequesnces[animationNumber]?.length - 1
      ) {
        this.player_animation_frame++;
      } else {
        this.player_animation_frame = 0;
      }
    }

    this.renderFrame(
      p5,
      animation_sequesnces[animationNumber][this.player_animation_frame],
      flip
    );
  }

  renderFrame(p5: p5Types, frameNumber: number, flip: boolean = false) {
    let framePos = p5.createVector(
      this.cat_sprite_json[frameNumber].frame.x,
      this.cat_sprite_json[frameNumber].frame.y
    );
    let frameSize = p5.createVector(
      this.cat_sprite_json[frameNumber].frame.w,
      this.cat_sprite_json[frameNumber].frame.h
    );

    if (flip) {
      p5.push();
      p5.scale(-1, 1);
      p5.image(
        this.cat_sprite_img,
        -this.pos.x - this.width,
        this.pos.y,
        this.width,
        this.height,
        framePos.x,
        framePos.y,
        frameSize.x,
        frameSize.y
      );
      p5.pop();
    } else {
      p5.image(
        this.cat_sprite_img,
        this.pos.x,
        this.pos.y,
        this.width,
        this.height,
        framePos.x,
        framePos.y,
        frameSize.x,
        frameSize.y
      );
    }
  }
}
