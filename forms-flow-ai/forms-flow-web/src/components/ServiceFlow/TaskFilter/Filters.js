import { useSelector } from "react-redux";

import React, { useEffect } from "react";

import {timeFormatter} from "../helper/helper";
import { indexOf } from "lodash";

const Filters = (props) => {
  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  useEffect(() => {
    // console.log("filterSearchSelections", filterSearchSelections);
  }, [filterSearchSelections]);



  const filters = filterSearchSelections.map((x, index) => {
    
    let trimmedDate = "";
    // Format the display of In Progress correctly
    if(x.value === 'Inprogress'){
      return (
        <div key={index} className="filters m-1 p-1">
          {x.label} : {'In Progress'}
          <span
            onClick={() => {
              props.handleDeleteFilter(index);
            }}
          >
            <i className="fa fa-solid fa-close p-2"></i>
          </span>
        </div>
      );
    } else if (x.key === 'followUp' || x.key === 'due'){
      // Format the display of the Next Appearance/Served Date Correctly 
      trimmedDate = x.value.substring(0, x.value.indexOf("T"));
      return (
        <div key={index} className="filters m-1 p-1">
          {x.label} {timeFormatter(trimmedDate)}
          <span
            onClick={() => {
              props.handleDeleteFilter(index);
            }}
          >
            <i className="fa fa-solid fa-close p-2"></i>
          </span>
        </div>
      )
    } else {
      return (
        <div key={index} className="filters m-1 p-1">
          {x.label} : {x.value}
          <span
            onClick={() => {
              props.handleDeleteFilter(index);
            }}
          >
            <i className="fa fa-solid fa-close p-2"></i>
          </span>
        </div>
      );
    }
  });

  return filters;
};

export default Filters;
