import React from "react";

const TextSearch = (props) => {
  return (
    <div className="top-level-filter">
      <div>
        <span>
          <b>{props.label}</b>
        </span>
      </div>
      <div>
        <input
          ref={props.searchRef}
          type="text"
          className="form-control"
          placeholder={props.placeholdertext}
        ></input>
      </div>
    </div>
  );
};

export default TextSearch;
