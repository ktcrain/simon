import React, { useEffect, useRef, useMemo, useCallback } from "react";
import "./quad.scss";
import Mousetrap from "mousetrap";
import { useBoardContext } from "../board/hooks";

const classNames = require("classnames");

function Quad({ index, color, shortcut, selected }) {
  const { handleClick, deselect } = useBoardContext();

  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    Mousetrap.bind(shortcut, onClick);
    return () => Mousetrap.unbind(shortcut);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      deselect({ index });
    }, 250);
    return () => clearTimeout(timer);
  });

  const onClick = useCallback(() => {
    return handleClick({ index, selected: selectedRef.current });
  }, [handleClick, index]);

  const quadClasses = classNames({
    Quad: true,
    [`Quad--${color}`]: true,
    selected: selectedRef.current,
  });

  const QuadButton = useMemo(() => {
    return (
      <button onClick={onClick} className={quadClasses}>
        {shortcut}
      </button>
    );
  }, [onClick, quadClasses, shortcut]);
  return QuadButton;
}

export default Quad;
