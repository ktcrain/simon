import React, { useContext, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import useBoard from "./useBoard";

const synth = new Tone.Synth();
synth.toDestination();

const BoardContext = React.createContext();
export default BoardContext;

const QuadContext = React.createContext();
export { QuadContext };

const BoardContextProvider = (props) => {
  const { state, dispatch, quads, quadsDispatch } = useBoard();
  const { status, sequence, userSequence } = state;
  const playingRef = useRef(0);

  const quadsRef = useRef(quads);

  const handlePlayQuad = useCallback(
    ({ index }) => {
      quadsDispatch({
        type: "PLAY_QUAD",
        payload: { index },
      });
      const quad = quadsRef.current[index];
      synth.triggerAttackRelease(quad.note, "8n", Tone.now());
    },
    [quadsDispatch]
  );

  const deselect = ({ index }) => {
    const quad = quads[index];
    if (quad.selected) {
      quadsDispatch({ type: "DESELECT", payload: { index } });
    }
  };

  useEffect(() => {
    let moveInterval;
    if (status === "SEQUENCE_PLAY") {
      const sequencePlay = () => {
        moveInterval = setInterval(() => {
          const index = sequence[playingRef.current];
          playingRef.current++;
          handlePlayQuad({ index });

          if (playingRef.current >= sequence.length) {
            clearInterval(moveInterval);
            playingRef.current = 0;
            dispatch({
              type: "SEQUENCE_END",
            });
          }
        }, 500);
      };
      setTimeout(sequencePlay, 1000);
    }
  }, [status, dispatch, sequence, handlePlayQuad]);

  const handleClick = ({ index }) => {
    if (status === "TURN_USER") {
      dispatch({
        type: "USER_SELECT",
        payload: { index, seqIndex: userSequence.length },
      });
      handlePlayQuad({ index });
    }
  };

  return (
    <BoardContext.Provider
      value={{
        state,
        dispatch,
        quads,
        quadsDispatch,
        handleClick,
        deselect,
      }}
    >
      {props.children}
    </BoardContext.Provider>
  );
};

function useBoardContext() {
  return useContext(BoardContext);
}

export { BoardContextProvider, useBoardContext };
