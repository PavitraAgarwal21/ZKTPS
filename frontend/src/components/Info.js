import React from "react";
import Img from "../Img/howtousezktps.png";
function Info() {
  return (
    <div className="flex flex-col items-center mt-20 text-gray-900">
      <h1 className="mb-12 text-white uppercase font-black">
        How to Use Project
      </h1>
      <img
        src={Img}
        style={{ height: "550px", width: "1250px" }}
        alt="Example"
      />
    </div>
  );
}

export default Info;
