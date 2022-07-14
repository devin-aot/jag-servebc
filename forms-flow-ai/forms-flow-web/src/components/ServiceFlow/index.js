import React, { useCallback, useEffect, useRef } from "react";
import ServiceFlowTaskList from "./list/ServiceTaskList";
import ServiceFlowTaskDetails from "./details/ServiceTaskDetails";
import { Container, Button } from "react-bootstrap";
import "./ServiceFlow.scss";
import {
  fetchFilterList,
  fetchProcessDefinitionList,
  fetchServiceTaskList,
  getBPMGroups,
  getBPMTaskDetail,
} from "../../apiManager/services/bpmTaskServices";
import { useDispatch, useSelector } from "react-redux";
import { ALL_TASKS } from "./constants/taskConstants";
import {
  reloadTaskFormSubmission,
  setBPMFilterLoader,
  setBPMTaskDetailLoader,
  setFilterListParams,
  setSelectedBPMFilter,
  setSelectedTaskID,
} from "../../actions/bpmTaskActions";
import SocketIOService from "../../services/SocketIOService";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import { Route, Redirect } from "react-router-dom";
import { push } from "connected-react-router";

import TaskFilter from "./TaskFilter";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

export default React.memo(() => {
  const dispatch = useDispatch();
  const filterList = useSelector((state) => state.bpmTasks.filterList);
  const isFilterLoading = useSelector(
    (state) => state.bpmTasks.isFilterLoading
  );
  const selectedFilter = useSelector((state) => state.bpmTasks.selectedFilter);
  const selectedFilterId = useSelector(
    (state) => state.bpmTasks.selectedFilter?.id || null
  );
  const bpmTaskId = useSelector((state) => state.bpmTasks.taskId);
  const reqData = useSelector((state) => state.bpmTasks.listReqParams);
  const sortParams = useSelector(
    (state) => state.bpmTasks.filterListSortParams
  );
  const searchParams = useSelector(
    (state) => state.bpmTasks.filterListSearchParams
  );
  const listReqParams = useSelector((state) => state.bpmTasks.listReqParams);
  const currentUser = useSelector(
    (state) => state.user?.userDetail?.preferred_username || ""
  );
  const firstResult = useSelector((state) => state.bpmTasks.firstResult);
  const taskList = useSelector((state) => state.bpmTasks.tasksList);
  const selectedFilterIdRef = useRef(selectedFilterId);
  const bpmTaskIdRef = useRef(bpmTaskId);
  const reqDataRef = useRef(reqData);
  const firstResultsRef = useRef(firstResult);
  const taskListRef = useRef(taskList);

  // Toggle the showApplication variable on the View/Edit button click
  const [showTaskDetails, setShowTaskDetails] = React.useState(false);
  const wrapperSetShowTaskDetails = useCallback(
    (val) => {
      setShowTaskDetails(val);
    },
    [setShowTaskDetails]
  );

  useEffect(() => {
    selectedFilterIdRef.current = selectedFilterId;
    bpmTaskIdRef.current = bpmTaskId;
    reqDataRef.current = reqData;
    firstResultsRef.current = firstResult;
    taskListRef.current = taskList;
  });

  useEffect(() => {
    const reqParamData = {
      ...{ sorting: [...sortParams.sorting] },
      ...searchParams,
    };
    if (!isEqual(reqParamData, listReqParams)) {
      dispatch(setFilterListParams(cloneDeep(reqParamData)));
    }
  }, [searchParams, sortParams, dispatch, listReqParams]);

  useEffect(() => {
    dispatch(setBPMFilterLoader(true));
    dispatch(fetchFilterList());
    dispatch(fetchProcessDefinitionList());
  }, [dispatch]);

  useEffect(() => {
    if (!isFilterLoading && filterList.length && !selectedFilter) {
      let filterSelected;
      if (filterList.length > 1) {
        filterSelected = filterList.find((filter) => filter.name === ALL_TASKS);
        if (!filterSelected) {
          filterSelected = filterList[0];
        }
      } else {
        filterSelected = filterList[0];
      }
      dispatch(setSelectedBPMFilter(filterSelected));
    }
  }, [filterList, isFilterLoading, selectedFilter, dispatch]);

  const checkIfTaskIDExistsInList = (list, id) => {
    return list.some((task) => task.id === id);
  };
  const SocketIOCallback = useCallback(
    (refreshedTaskId, forceReload, isUpdateEvent) => {
      if (forceReload) {
        dispatch(
          fetchServiceTaskList(
            selectedFilterIdRef.current,
            firstResultsRef.current,
            reqDataRef.current,
            refreshedTaskId
          )
        ); //Refreshes the Tasks
        if (bpmTaskIdRef.current && refreshedTaskId === bpmTaskIdRef.current) {
          dispatch(setBPMTaskDetailLoader(true));
          dispatch(setSelectedTaskID(null)); // unSelect the Task Selected
          dispatch(push(`/task/`));
        }
      } else {
        if (selectedFilterIdRef.current) {
          if (isUpdateEvent) {
            /* Check if the taskId exists in the loaded Task List */
            if (
              checkIfTaskIDExistsInList(
                taskListRef.current,
                refreshedTaskId
              ) === true
            ) {
              dispatch(
                fetchServiceTaskList(
                  selectedFilterIdRef.current,
                  firstResultsRef.current,
                  reqDataRef.current
                )
              ); //Refreshes the Task
            }
          } else {
            dispatch(
              fetchServiceTaskList(
                selectedFilterIdRef.current,
                firstResultsRef.current,
                reqDataRef.current
              )
            ); //Refreshes the Task
          }
        }
        if (bpmTaskIdRef.current && refreshedTaskId === bpmTaskIdRef.current) {
          //Refreshes task if its selected
          dispatch(
            getBPMTaskDetail(bpmTaskIdRef.current, (err, resTask) => {
              // Should dispatch When task claimed user  is not the logged in User
              if (resTask?.assignee !== currentUser) {
                dispatch(reloadTaskFormSubmission(true));
              }
            })
          );
          dispatch(getBPMGroups(bpmTaskIdRef.current));
        }
      }
    },
    [dispatch, currentUser]
  );

  useEffect(() => {
    if (!SocketIOService.isConnected()) {
      SocketIOService.connect((refreshedTaskId, forceReload, isUpdateEvent) =>
        SocketIOCallback(refreshedTaskId, forceReload, isUpdateEvent)
      );
    } else {
      SocketIOService.disconnect();
      SocketIOService.connect((refreshedTaskId, forceReload, isUpdateEvent) =>
        SocketIOCallback(refreshedTaskId, forceReload, isUpdateEvent)
      );
    }
    return () => {
      if (SocketIOService.isConnected()) SocketIOService.disconnect();
    };
  }, [SocketIOCallback, dispatch]);

  const onClickBackButton = () => {
    dispatch(push(`/task`));
    setShowTaskDetails(false);
  };

  const generatePDF = (canvas, mode, isTable) => {
    let HTML_Width = canvas.width;
    let HTML_Height = canvas.height;
    let top_left_margin = 15;
    let PDF_Width = HTML_Width + top_left_margin * 2;
    let PDF_Height = isTable ? 1950 : PDF_Width * 1.5 + top_left_margin * 2;
    let canvas_image_width = HTML_Width;
    let canvas_image_height = HTML_Height;
    let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
    canvas.getContext("2d");
    let imgData = canvas.toDataURL("image/jpeg", 1.0);
    let pdf = new jsPDF(mode, "pt", [PDF_Width, PDF_Height]);
    pdf.addImage(
      imgData,
      "JPG",
      top_left_margin,
      top_left_margin,
      canvas_image_width,
      canvas_image_height
    );
    for (let i = 1; i <= totalPDFPages; i++) {
      pdf.addPage([PDF_Width, PDF_Height], mode);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        -(PDF_Height * i) + top_left_margin * 4,
        canvas_image_width,
        canvas_image_height
      );
    }
    pdf.save("Serve Legal.pdf");
  };

  const alertPDFDisplayIssue = () => {
    if (window.innerWidth < 1295) {
      toast.warning(`Warning: The PDF may not generate correctly on small screens such as phones or tablets.
      \n\nThe full table must be visible in order to generate the PDF properly.`);
    }
  };

  const printTableToPDF = () => {
    alertPDFDisplayIssue();
    document.getElementById("main").style.height = "auto";
    let elementToPrint = document.getElementById("main");
    // Alert the user that if their viewport width is too small, the PDF may not generate correctly
    //lementToPrint.style.height = "auto;";

    //elementToPrint = document.getElementById("main");
    html2canvas(elementToPrint, {
      ignoreElements: function (element) {
        if (element.id === "html2canvas-ignore-element") {
          return true;
        }
      },
    }).then((canvas) => {
      generatePDF(canvas, "l", true);
    });

    document.getElementById("main").style.height = "100vh";
  };

  const CheckIsHistoryTabSelected = () => {
    let isHistoryTabSelected = document.getElementById(
      "service-task-details-tab-history"
    ).ariaSelected;

    if (isHistoryTabSelected === "true") {
      toast.error(
        `Sorry - You cannot print to PDF while the History tab is selected. \nPlease select the 'Form' tab and try again.`
      );
    }

    return isHistoryTabSelected === "true" ? true : false;
  };

  const handlePrintFormWithNotes = () => {
    let isHistoryTabSelected = CheckIsHistoryTabSelected();
    if (!isHistoryTabSelected) {
      printPDFForForms();
    }
  };

  const handlePrintFormWithoutNotes = () => {
    let isHistoryTabSelected = CheckIsHistoryTabSelected();
    if (!isHistoryTabSelected) {
      toggleNotesSection("none");
      printPDFForForms();
      toggleNotesSection("block");
    }
  };

  const toggleNotesSection = (value) => {
    document.getElementsByClassName(
      "formio-component-notes"
    )[0].parentElement.parentElement.parentElement.style.display = value;
  };

  const printPDFForForms = () => {
    alertPDFDisplayIssue();
    const elementToPrint = document.getElementsByClassName("container")[0];
    html2canvas(elementToPrint, {
      ignoreElements: function (element) {
        if (element.id === "html2canvas-ignore-element") {
          return true;
        }
      },
    }).then((canvas) => {
      generatePDF(canvas, "p", false);
    });
  };

  return (
    <Container fluid id="main">
      {!showTaskDetails ? (
        <section>
          <TaskFilter printPDFCallback={printTableToPDF} />
          <ServiceFlowTaskList
            showApplicationSetter={wrapperSetShowTaskDetails}
          />
        </section>
      ) : (
        <div className="container-task-view">
          <div className="task-view-top">
            <Button className="remove_button_css" onClick={onClickBackButton}>
              <i className="fa fa-angle-left" />
              {"  "} Back to search results
            </Button>


            <div className="dropdown padding-print-button">
              <Button className="BC-Gov-SecondaryButton">
                <i class="fa fa-print mx-1"></i>

                Print PDF {"  "}
                <i className="fa fa-caret-down"></i>
              </Button>
              <div className="dropdown-content">
                <Button
                  className="BC-Gov-SecondaryButton pdf-options"
                  onClick={handlePrintFormWithoutNotes}
                >
                  Without Notes
                </Button>
                <Button
                  className="BC-Gov-SecondaryButton pdf-options"
                  onClick={handlePrintFormWithNotes}
                >
                  With Notes
                </Button>
              </div>
            </div>
          </div>
          <Container fluid id="main">
            <Route path={"/task/:taskId?"}>
              <ServiceFlowTaskDetails
                id="main"
                showApplicationSetter={wrapperSetShowTaskDetails}
              />
            </Route>
            <Route path={"/task/:taskId/:notAvailable"}>
              {" "}
              <Redirect exact to="/404" />
            </Route>
          </Container>
        </div>
      )}
    </Container>
  );
});
