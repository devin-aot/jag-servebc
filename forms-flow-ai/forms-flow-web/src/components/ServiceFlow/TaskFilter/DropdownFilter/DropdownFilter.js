import React from "react";

const DropdownFilter = (props) => {
  return (
    <div className="top-level-filter">
      <div>
        <span>
          <b>{props.label}</b>
        </span>
      </div>
      <div>
        <select className="form-control" ref={props.controlRef}>
          {props.options.map((x) => {
            return (
              <option key={x.id} value={x.value}>
                {x.name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default DropdownFilter;
