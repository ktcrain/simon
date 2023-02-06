import { useReducer } from "react";
import getQuadData from "./getQuadData";

const getRandomQuadIndex = () => {
  return Math.floor(Math.random() * Math.floor(4));
};

function getInitialState() {
  const initialState = {
    status: "WELCOME", // WELCOME, TURN_COMPUTER, TURN_USER, GAME_OVER
    sequence: [getRandomQuadIndex()],
    userSequence: [],
    score: 0,
  };
  return initialState;
}

/**
 *
 * @param {*} state
 * @param {*} action
 */
function boardReducer(state, action) {
  const { type, payload } = action;

  console.log("boardReducer", type, payload);

  switch (type) {
    case "USER_SELECT":
      state.userSequence[payload.seqIndex] = payload.index;
      if (
        state.userSequence[payload.seqIndex] !==
        state.sequence[payload.seqIndex]
      ) {
        state.status = "GAME_OVER";
      } else if (state.userSequence.length === state.sequence.length) {
        state.score = state.sequence.length;
        state.status = "SEQUENCE_PLAY";
        state.sequence[payload.seqIndex + 1] = getRandomQuadIndex();
      }
      break;
    case "SEQUENCE_END":
      state.userSequence = [];
      state.status = "TURN_USER";
      break;
    case "RESET":
      state = getInitialState();
      state.status = "SEQUENCE_PLAY";
      break;
    default:
      throw new Error(`unexpected action type: ", ${type}`);
  }

  return { ...state };
}

/**
 *
 * @param {*} state
 * @param {*} action
 */
function quadsReducer(state, action) {
  const { type, payload } = action;
  const { index } = payload;
  const quad = state[index];

  const editQuad = (rowIndex, st) =>
    (state[rowIndex] = Object.assign({}, { ...state[rowIndex] }, st));

  switch (type) {
    case "PLAY_QUAD":
      // Reset quads
      state.forEach((q, i) => {
        editQuad(q.index, { selected: false });
      });
      editQuad(quad.index, { selected: true });
      break;
    case "DESELECT":
      editQuad(quad.index, { selected: false });
      break;
    case "RESET":
      state = getQuadData();
      break;
    default:
      throw new Error(`unexpected action type: ", ${type}`);
  }
  return [...state];
}

/**
 * useBoard
 *
 * Creates a reducer
 *
 * @return {state, dispatch} action  */

function useBoard() {
  const initialState = getInitialState();
  const [quads, quadsDispatch] = useReducer(quadsReducer, getQuadData());

  const [state, dispatch] = useReducer(boardReducer, initialState);
  return { state, dispatch, quads, quadsDispatch };
}

export default useBoard;
