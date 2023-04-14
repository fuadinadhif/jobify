import React from "react";

function Loading({ center, style }) {
  return (
    <div
      className={center ? "loading loading-center" : "loading"}
      style={style}
    ></div>
  );
}

export default Loading;
