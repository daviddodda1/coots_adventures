import styles from "@/styles/Game.module.css";
import p5Types from "p5";
import { useState, useEffect, useRef } from "react";
import startScreen from "../../assets/startScreen.png";
import dynamic from "next/dynamic";
import Player from "../../gameClasses/player";
import { game_width, game_height } from "../../constants";

import cat_sprite_png from "../../assets/cat_spritesheet.png";
import cat_sprite_json from "../../assets/cat_spritesheet.json";

import platform_sprite_png from "../../assets/p_sprites.png";
import platform_sprite_json from "../../assets/p_sprites.json";

import cutscenes_sprite_png from "../../assets/cutseens.png";
import cutscenes_sprite_json from "../../assets/cutseens.json";

import backgroundImg from "../../assets/GameBg.png";
import Background from "../../gameClasses/background";
import Platform, { PlatformTypes } from "../../gameClasses/platform";

import gameMapJson from "../../assets/gamemap.json";
import Cutscenes, {
  CutsceneConstants,
  CutsceneType,
} from "../../gameClasses/cutscenes";
import moment from "moment";

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

export default function Game({}: any) {
  const [canvas, setCanvas] = useState<p5Types.Renderer>();

  const [gameBG, setGameBG]: [any, any] = useState({});

  const [isCutsceneActive, setIsCutsceneActive]: [any, any] = useState(false);

  const [isStartingCutScenePlayer, setIsStartingCutScenePlayer]: [any, any] =
    useState(false);

  const [cutSchenes, setCutSchenes]: [Cutscenes | any, any] = useState({});

  const [player, setPlayer]: [any, any] = useState({});

  const [platforms, setPlatforms]: [any, any] = useState([{}]);

  const [playerSprite, setPlayerSprite]: [any, any] = useState({});

  const [platformSprite, setPlatformSprite]: [any, any] = useState({});
  const [platformSpriteJSON, setPlatformSpriteJSON]: [any, any] = useState({});

  const [cutsceneSprite, setCutsceneSprite]: [any, any] = useState({});
  const [cutsceneSpriteJSON, setCutsceneSpriteJSON]: [any, any] = useState({});

  const [gameMap, setGameMap]: [any, any] = useState({});

  const [current_fps, set_current_fps] = useState(0);

  const gameHeight = 1080 * 3;
  const gameWidth = 1280;

  let lastKeyPress = 0;

  const [showPlayerScore, setShowPlayerScore] = useState(false);

  // Timer code

  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState<number>(0);
  const [stopWatchActive, setStopWatchActive] = useState(false);

  const startTimer = () => {
    setStopWatchActive(true);
  };

  const stopTimer = () => {
    setStopWatchActive(false);
  };
  // const formattedElapsed = moment.utc(elapsed).format("HH:mm:ss.SSS");
  // const playStartingCutscene = () => {
  //   setIsCutsceneActive(true);
  //   console.log(CutsceneConstants);
  //   for (let i = 0; i < CutsceneConstants.START.frames.length; i++) {
  //     setTimeout(() => {
  //       console.log("frame: " + i);
  //       cutSchenes.nextFrame();
  //     }, 2000 * i);
  //   }
  // };

  const preload = (p5: p5Types) => {
    const cat_sprite_img = p5.loadImage(cat_sprite_png.src);

    const bg = new Background(1280, 720, p5.loadImage(backgroundImg.src), p5);

    setGameBG(bg);
    setPlayerSprite(cat_sprite_img);
    setPlatformSprite(p5.loadImage(platform_sprite_png.src));
    setPlatformSpriteJSON(platform_sprite_json.frames);
    setGameMap(gameMapJson);
    setCutsceneSprite(p5.loadImage(cutscenes_sprite_png.src));
    setCutsceneSpriteJSON(cutscenes_sprite_json.frames);
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.frameRate(60); // Attempt to refresh at starting FPS
    const canvasInstance = p5
      .createCanvas(game_width, game_height)
      .parent(canvasParentRef);

    setCanvas(canvasInstance);

    // init cutscenes
    const cutsceneManager = new Cutscenes(
      0,
      0,
      1280,
      720,
      CutsceneType.START,
      p5
    );
    setCutSchenes(cutsceneManager);

    setIsCutsceneActive(true);
    setIsStartingCutScenePlayer(false);

    // init player
    const player = new Player(
      1280 / 2,
      gameHeight - 100,
      64,
      64,
      p5,
      playerSprite,
      cat_sprite_json.frames
    );
    setPlayer(player);

    // init playforms
    const platforms = [];

    // FLOOR
    const platform1 = new Platform(
      0,
      gameHeight,
      1280,
      50,
      PlatformTypes.WALL_B,
      p5
    );
    // LEFT WALL
    const platform4 = new Platform(
      0,
      -100,
      50,
      gameHeight,
      PlatformTypes.WALL_L,
      p5
    );
    // RIGHT WALL
    const platform5 = new Platform(
      1270,
      -100,
      50,
      gameHeight,
      PlatformTypes.WALL_R,
      p5
    );

    platforms.push(platform4);
    platforms.push(platform5);
    platforms.push(platform1);

    for (const element of gameMap) {
      const platform = new Platform(
        element.x,
        element.y,
        element.width,
        element.height,
        element.type,
        p5
      );
      platforms.push(platform);
    }

    setPlatforms(platforms);
  };

  const draw = (p5: p5Types) => {
    p5.background(0);

    if (p5.frameCount % 10 == 0) {
      if (stopWatchActive) {
        setElapsed(Date.now() - startTime);
      }
    }

    if (isCutsceneActive && !isStartingCutScenePlayer) {
      // instruction to go to next frame

      // check if space is pressed
      if (
        p5.keyIsPressed &&
        p5.key == " " &&
        p5.millis() - lastKeyPress > 500 &&
        cutSchenes.current_frame < CutsceneConstants.START.frames.length
      ) {
        lastKeyPress = p5.millis();
        cutSchenes.nextFrame();
        if (cutSchenes.current_frame == CutsceneConstants.START.frames.length) {
          setIsStartingCutScenePlayer(true);
          setIsCutsceneActive(false);
          setStartTime(Date.now());
          startTimer();
        }
      }
      if (cutSchenes.current_frame < CutsceneConstants.START.frames.length) {
        cutSchenes.draw(p5, cutsceneSpriteJSON, cutsceneSprite);
      }
      p5.push();
      p5.fill(255);
      p5.textSize(20);
      p5.text("Press Space To Continue...", 500, 670);
      p5.pop();
      return;
    }

    // Check Game End
    if (player.pos) {
      if (
        (player.pos.y < 125 && player.pos.x + player.width < 88) ||
        (player.pos.y < 125 && player.pos.x > gameWidth - 88)
      ) {
        if (cutSchenes.type != CutsceneType.END) {
          cutSchenes.type = CutsceneType.END;
          cutSchenes.current_frame = 0;
          setIsCutsceneActive(true);
          stopTimer();
        }
        // check if space is pressed
        if (isCutsceneActive) {
          if (
            p5.keyIsPressed &&
            p5.key == " " &&
            p5.millis() - lastKeyPress > 500 &&
            cutSchenes.current_frame < CutsceneConstants.END.frames.length
          ) {
            lastKeyPress = p5.millis();
            cutSchenes.nextFrame();
            if (
              cutSchenes.current_frame == CutsceneConstants.END.frames.length
            ) {
              setIsCutsceneActive(false);
              setShowPlayerScore(true);
            }
          }
          if (cutSchenes.current_frame < CutsceneConstants.END.frames.length) {
            cutSchenes.draw(p5, cutsceneSpriteJSON, cutsceneSprite);
          }
          p5.push();
          p5.fill(255);
          p5.textSize(20);
          p5.text("Press Space To Continue...", 500, 690);
          p5.pop();
          return;
        }
      }
    }
    if (player.pos && player.vel) {
      if (p5.frameCount % 30 == 0) {
        set_current_fps(parseInt(p5.frameRate().toFixed(0)));
      }
      // Update player
      gameBG.draw(p5);
      p5.push();
      p5.fill(255);
      p5.text("FPS: " + current_fps, 10, 20);
      p5.pop();

      let cameraPos = p5.createVector(0, 0);

      // Update camera position based on player position
      cameraPos.x = player.pos.x - game_width / 2;
      cameraPos.y = player.pos.y - game_height / 2;

      // Translate canvas to center on camera position
      p5.translate(-cameraPos.x, -cameraPos.y);

      // Draw game elements (e.g. platforms, player)
      if (platforms.length > 0) {
        renderWinningLadder(p5);

        player.draw(p5);
        player.update(p5, platforms);

        for (const element of platforms) {
          element.draw(p5, platformSpriteJSON, platformSprite);
        }
      }
      // Translate canvas back to original position
      p5.translate(cameraPos.x, cameraPos.y);
    }
  };

  const renderWinningLadder = (p5: p5Types) => {
    p5.push();

    p5.image(
      platformSprite,
      0,
      0,
      88,
      125,
      platformSpriteJSON[10].frame.x,
      platformSpriteJSON[10].frame.y,
      platformSpriteJSON[10].frame.w,
      platformSpriteJSON[10].frame.h
    );

    p5.image(
      platformSprite,
      gameWidth - 88,
      0,
      88,
      125,
      platformSpriteJSON[10].frame.x,
      platformSpriteJSON[10].frame.y,
      platformSpriteJSON[10].frame.w,
      platformSpriteJSON[10].frame.h
    );
    p5.pop();
  };

  const formatTime = (time: number) => {
    console.log(showPlayerScore);
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    const milliseconds = ((time % 60000) % 100).toFixed(0);
    return `${parseInt(seconds) < 10 ? "0" : ""}${seconds}:${
      parseInt(milliseconds) < 10 ? "0" : ""
    }${milliseconds}`;
  };

  return (
    <div className={styles.container}>
      {stopWatchActive ? <h1>{`${formatTime(elapsed)}`}</h1> : ""}
      <>
        {!showPlayerScore ? (
          <Sketch preload={preload} setup={setup} draw={draw} />
        ) : (
          <div className={styles.PlayerScoreContainer}>
            <div className={styles.imgContainer}>
              <img src={startScreen.src} alt="start screen img" />
            </div>
            <div className={styles.PlayerScore}>
              <h1>Your Time!</h1>
              <h2>{`${formatTime(elapsed)}`}</h2>
            </div>
            {/* <div className={styles.footer}>
              Liked The Game?{" "}
              <a href="https://www.buymeacoffee.com/daviddodda">
                Buy Me A Coffee :)
              </a>
            </div> */}
          </div>
        )}
      </>
    </div>
  );
}
