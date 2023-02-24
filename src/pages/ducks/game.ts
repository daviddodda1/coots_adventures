import { GameState } from "../interfaces/store";

const initialState: GameState = {
  playerX: "0",
  playerY: "0",
  cameraY: 0,
  gameMap: [{}],
  gameWidth: 1280,
  gameHeight: 720,
};

export const actionTypes = {
  UPDATE_PLAYER_POSITION: "UPDATE_PLAYER_POSITION",
  UPDATE_CAMERA_POSITION: "UPDATE_CAMERA_POSITION",
};

export const actions = {
  updatePlayerPosition: (playerX: string, playerY: string) => ({
    type: actionTypes.UPDATE_PLAYER_POSITION,
    playerX,
    playerY,
  }),
  updateCameraPosition: (cameraY: number) => ({
    type: actionTypes.UPDATE_CAMERA_POSITION,
    cameraY,
  }),
};

export default function reducer(state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.UPDATE_PLAYER_POSITION:
      return {
        ...state,
        playerX: action.playerX,
        playerY: action.playerY,
      };
    case actionTypes.UPDATE_CAMERA_POSITION:
      return {
        ...state,
        cameraY: action.cameraY,
      };
    default:
      return state;
  }
}
