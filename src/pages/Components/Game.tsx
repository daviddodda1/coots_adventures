import styles from "@/styles/Game.module.css";
import p5Types from "p5";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions as gameActions } from "../ducks/game";

import dynamic from "next/dynamic";
import { Platform, PlatformTypes, Player } from "../gameClasses/player";
import { game_width, game_height } from "../constants";

import cat_sprite_png from "../../assets/cat_spritesheet.png";
import cat_sprite_json from "../..//assets/cat_spritesheet.json";

// Will only import `react-p5` on client-side
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

export default function Game({}: any) {
  const [canvas, setCanvas] = useState<p5Types.Renderer>();

  const [player, setPlayer]: [any, any] = useState({});

  const [platforms, setPlatforms]: [any, any] = useState([{}]);

  const [playerSprite, setPlayerSprite]: [any, any] = useState({});

  const [current_fps, set_current_fps] = useState(0);

  const gameState = useSelector((state: any) => state.game);

  const preload = (p5: p5Types) => {
    console.log(cat_sprite_json);
    console.log(cat_sprite_png);
    const cat_sprite_img = p5.loadImage(cat_sprite_png.src, (data) => {
      console.log(data);
    });
    setPlayerSprite(cat_sprite_img);
  };

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.frameRate(60); // Attempt to refresh at starting FPS
    const canvasInstance = p5
      .createCanvas(gameState.gameWidth, gameState.gameHeight)
      .parent(canvasParentRef);

    setCanvas(canvasInstance);

    // init player
    const player = new Player(
      720 / 2,
      0,
      64,
      64,
      p5,
      playerSprite,
      cat_sprite_json.frames
    );
    setPlayer(player);

    // init playforms
    const platforms = [];
    const platform1 = new Platform(0, 600, 1280, 50, PlatformTypes.NORMAL, p5);
    const platform2 = new Platform(0, 550, 300, 50, PlatformTypes.SLIPPERY, p5);
    const platform3 = new Platform(800, 450, 300, 50, PlatformTypes.NORMAL, p5);

    platforms.push(platform1);
    platforms.push(platform2);
    platforms.push(platform3);

    setPlatforms(platforms);
  };

  const draw = (p5: p5Types) => {
    // Update player

    p5.background(0);

    p5.push();
    p5.fill(255);
    p5.text("FPS: " + current_fps, 10, 20);
    p5.pop();
    if (p5.frameCount % 30 == 0) {
      set_current_fps(parseInt(p5.frameRate().toFixed(0)));
    }

    let cameraPos = p5.createVector(0, 0);

    // Update camera position based on player position
    cameraPos.x = player.pos.x - game_width / 2;
    cameraPos.y = player.pos.y - game_height / 2;

    // Translate canvas to center on camera position
    p5.translate(-cameraPos.x, -cameraPos.y);

    // Draw game elements (e.g. platforms, player)
    if (platforms.length > 0) {
      player.draw(p5);
      player.update(p5, platforms);

      for (const element of platforms) {
        element.draw(p5);
      }
    }
    // Translate canvas back to original position
    p5.translate(cameraPos.x, cameraPos.y);
  };

  return (
    <div className={styles.container}>
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  );
}
