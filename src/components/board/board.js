import React, { useMemo } from "react";
import "./board.scss";
import { useBoardContext } from "./hooks";
import Quad from "../quad";
const classNames = require("classnames");

console.log(useBoardContext);

function Board() {
  const { state, dispatch, quads } = useBoardContext();
  const { score, status } = state;
  const waiting = status === "WELCOME" || status === "GAME_OVER";

  const handlePlayButton = () => {
    dispatch({
      type: "RESET",
      payload: { index: null, seqLength: 0, score: 0 },
    });
  };

  const statusMap = {
    WELCOME: "Click the center to get started.",
    SEQUENCE_PLAY: "Pay attention!",
    TURN_USER: "Your turn!",
    GAME_OVER: "Game over.",
  };

  const StatusMessage = () => {
    return <h1>{statusMap[state.status]}</h1>;
  };

  const Quads = () => {
    return quads.map((quad) => <Quad key={quad.index} {...quad} />);
  };

  const Board = () =>
    useMemo(() => {
      const boardLogoClasses = classNames({
        "Board-Logo": true,
        waiting: waiting,
      });

      return (
        <div className="Board">
          <div className="Board-Inner">
            <Quads />
            <a className={boardLogoClasses} onClick={handlePlayButton}>
              {score > 0 ? score : "simon"}
            </a>
          </div>
        </div>
      );
    }, []);

  return (
    <div>
      <StatusMessage />
      <Board />
    </div>
  );
}
export default Board;
