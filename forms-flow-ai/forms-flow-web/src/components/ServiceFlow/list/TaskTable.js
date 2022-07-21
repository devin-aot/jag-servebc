import React from "react";

// Import Table Components
import TableHeader from "./TableHeader";
import TableData from "./TableData";

import { Button } from "react-bootstrap";

// Import Constants
import {
  DOCUMENT_STATUS,
  PARTY_NAME,
  IS_CRIMINAL,
  COURT_OR_TRIBUNAL_FILE_NUMBER,
  LAWYER_NAME,
  REGISTRY,
  DOCUMENT_TYPE,
  STAFF_GROUP,
  ASSIGNEE,
} from "../constants/taskConstants";

// Used to format 'Assignee' column to show First/Last Name instead of idir
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserList } from "../../../apiManager/services/bpmTaskServices";
import { getUserNamefromList } from "../../../apiManager/services/formatterService";

const TaskTable = React.memo(
  ({ tableHeaders, taskServeLegalDocs, timeFormatter, onViewEditChanged }) => {
    
    // Used to format 'Assignee' column to show First/Last Name instead of idir
    const dispatch= useDispatch();
    const [userList, setUserList] = useState([]);
    useEffect(()=>{
      dispatch(fetchUserList( (err, res) => {
        if (!err) {
          setUserList(res);
        }
      }))
    },[]);
    
  
    const getColumnValueFromList = (task, name) => {
      let item = task._embedded.variable.filter((v) => v.name == name);

      if (item.length === 0) return null;

      return item[0];
    };

    const renderColumn = (task, param) => {
      return getColumnValueFromList(task, param) === null ? (
        <td></td>
      ) : (
        <TableData indexOfData={getColumnValueFromList(task, param).value} />
      );
    };

    return (
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <TableHeader header={header} key={header.key} />
              ))}
            </tr>
          </thead>
          <tbody>
            {taskServeLegalDocs.map((task) => (
              <tr key={task.id}>
                {renderColumn(task, PARTY_NAME)}

                {renderColumn(task, DOCUMENT_STATUS)}

                {renderColumn(task, STAFF_GROUP)}

                {renderColumn(task, IS_CRIMINAL)}

                {renderColumn(task, COURT_OR_TRIBUNAL_FILE_NUMBER)}

                {task.due === undefined ? (
                  <td></td>
                ) : (
                  <TableData indexOfData={task.due} formatter={timeFormatter} />
                )}

                {task.followUp === undefined ? (
                  <td></td>
                ) : (
                  <TableData
                    indexOfData={task.followUp}
                    formatter={timeFormatter}
                  />
                )}
                {renderColumn(task, REGISTRY)}

                {renderColumn(task, DOCUMENT_TYPE)}

                {renderColumn(task, LAWYER_NAME)}

                {task.assignee === undefined ? (
                  <td></td>
                ) : (
                  <TableData indexOfData={getUserNamefromList(userList, task.assignee)} />
                )}
                {/* View/Edit Button */}
                <TableData
                  indexOfData={
                    <Button
                      className="button-view-edit"
                      onClick={() => {
                        onViewEditChanged(task);
                      }}
                    >
                      View/Edit
                    </Button>
                  }
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

export default TaskTable;
