import React, { useEffect, useRef, useState } from "react";
import {
  setFilterListSearchParams,
  setIsVariableValueIgnoreCase,
} from "../../../actions/bpmTaskActions";
import { useDispatch, useSelector } from "react-redux";
import "./TaskFilter.scss";
import DropdownFilter from "./DropdownFilter/DropdownFilter";
import TextSearch from "./TextSearchFilter/TextSearch";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import {
  crimalStatusOptions,
  documentStatusOptions,
  documentType,
  staffGroup,
} from "./Constants";
import Filters from "./Filters";

const TaskFilter = React.memo(({ printPDFCallback }) => {
  const dispatch = useDispatch();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [nextAppearanceStartDate, setNextAppearanceStartDate] = useState(null);
  const [nextAppearanceEndDate, setNextAppearanceEndDate] = useState(null);

  const [topLevelFilter, setTopLevelFilter] = useState([]);
  const [advancedFilter, setAdvancedFilter] = useState([]);

  const searchRef = useRef();
  const criminalStatusRef = useRef();
  const documentStatusRef = useRef();
  const fileNumberRef = useRef();
  const documentTypeRef = useRef();
  const staffGroupRef = useRef();
  const lawyerNameRef = useRef();
  const editedByRef = useRef();

  const filterSearchSelections = useSelector(
    (state) => state.bpmTasks.filterSearchSelections
  );

  useEffect(() => {
    dispatch(setIsVariableValueIgnoreCase(true));
  }, []);

  const handleAdvancedShowFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Show values on applied filters when advanced filter box is shown
  useEffect(() => {

    advancedFilter.map((x) => {
      if (x.name == "courtOrTribunalFileNbr") {
        fileNumberRef.current.value = x.value;
      }
      if (x.name == "lawyerName") {
        lawyerNameRef.current.value = x.value;
      }
      if (x.key == "assignee") {
        editedByRef.current.value = x.value;
      }
    });

  }, [showAdvancedFilters]);

  const createSearchObject = (key, label, name, operator, type, value) => {
    const obj = {
      key: key,
      label: label,
      name: name,
      operator: operator,
      type: type,
      value: value,
    };
    return obj;
  };

  const applyTopLevelFilter = () => {
    let newSearchArray = [];

    if (searchRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Party",
        name: "partyName",
        operator: "like",
        type: "variables",
        value: searchRef.current.value,
      });
    }

    if (staffGroupRef.current.value != "") {
      newSearchArray.push(
        createSearchObject(
          "processVariables",
          "Responsibility",
          "staffGroup",
          "=",
          "variables",
          staffGroupRef.current.value
        )
      );
    }

    if (criminalStatusRef.current.value != "") {
      newSearchArray.push(
        createSearchObject(
          "processVariables",
          "Criminal Matter",
          "isCriminal",
          "=",
          "variables",
          criminalStatusRef.current.value
        )
      );
    }

    if (documentStatusRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Document Status",
        name: "documentStatus",
        operator: "=",
        type: "variables",
        value: documentStatusRef.current.value,
      });
    }

    if (documentTypeRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Document Type",
        name: "documentType",
        operator: "=",
        type: "variables",
        value: documentTypeRef.current.value,
      });
    }

    dispatch(setFilterListSearchParams([...advancedFilter, ...newSearchArray]));
    setTopLevelFilter(newSearchArray);

  };

  const applyAdvancedFilter = () => {
    let newSearchArray = [];

    if (fileNumberRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Court/Tribunal File #",
        name: "courtOrTribunalFileNbr",
        operator: "like",
        type: "variables",
        value: fileNumberRef.current.value,
      });
    }

    if (lawyerNameRef.current.value != "") {
      newSearchArray.push({
        key: "processVariables",
        label: "Lawyer Name",
        name: "lawyerName",
        operator: "like",
        type: "variables",
        value: lawyerNameRef.current.value,
      });
    }

    if (editedByRef.current.value != "") {
      newSearchArray.push({
        key: "assignee",
        label: "In Use By",
        operator: "like",
        type: "string",
        value: editedByRef.current.value,
      });
    }

    if (nextAppearanceStartDate != null) {
      newSearchArray.push({
        key: "followUp",
        label: "Next Apperance Date (From)",
        operator: "after",
        type: "date",
        value: `${nextAppearanceStartDate.getFullYear()}-${
          nextAppearanceStartDate.getMonth() + 1
        }-${nextAppearanceStartDate.getDate()}T00:00:00.000-0000`,
      });

      newSearchArray.push({
        key: "followUp",
        label: "Next Apperance Date (To)",
        operator: "before",
        type: "date",
        value: `${nextAppearanceEndDate.getFullYear()}-${
          nextAppearanceEndDate.getMonth() + 1
        }-${nextAppearanceEndDate.getDate()}T23:59:00.000-0000`,
      });
    }

    if (startDate != null) {
      newSearchArray.push({
        key: "due",
        label: "Serve Date (From):",
        operator: "after",
        type: "date",
        value: `${startDate.getFullYear()}-${
          startDate.getMonth() + 1
        }-${startDate.getDate()}T00:00:00.000-0000`,
      });

      newSearchArray.push({
        key: "due",
        label: "Serve Date (To):",
        operator: "before",
        type: "date",
        value: `${endDate.getFullYear()}-${
          endDate.getMonth() + 1
        }-${endDate.getDate()}T23:59:00.000-0000`,
      });
    }

    setAdvancedFilter(newSearchArray);
    dispatch(setFilterListSearchParams([...topLevelFilter, ...newSearchArray]));

  };

  const handleDeleteFilter = (index) => {

    var filteredArr = [...filterSearchSelections];
    let selectedItem = { ...filteredArr[index] };

    if (selectedItem.key == "followUp") {
      let list = topLevelFilter.filter((x) => x.key != "followUp");
      setTopLevelFilter(list);
      var newlist = filterSearchSelections.filter((x) => x.key != "followUp");
      setNextAppearanceEndDate(null);
      setNextAppearanceStartDate(null);
      dispatch(setFilterListSearchParams(newlist));
    } else if (selectedItem.key == "due") {
      let list = topLevelFilter.filter((x) => x.key != "due");
      setTopLevelFilter(list);
      var newlist = filterSearchSelections.filter((x) => x.key != "due");
      setStartDate(null);
      setEndDate(null);
      dispatch(setFilterListSearchParams(newlist));
    } else {
      if (selectedItem.key == "processVariables") {

        let list = advancedFilter.filter((x) => x.name != selectedItem.name);
        setAdvancedFilter(list);
        
        let updatedSearchList = topLevelFilter.filter(
          (x) => x.name != selectedItem.name
        );
        setTopLevelFilter(updatedSearchList);

        if(selectedItem.name === 'staffGroup') { 
          staffGroupRef.current.value = ""
        } else if(selectedItem.name === 'documentStatus') { 
          documentStatusRef.current.value = ""
        } else if(selectedItem.name === 'documentType') { 
          documentTypeRef.current.value = ""
        } else if(selectedItem.name === 'isCriminal') { 
          criminalStatusRef.current.value = ""
        } else if(selectedItem.name === 'partyName' && searchRef.current != null) { 
          searchRef.current.value = ""
          searchRef.current.placeholdertext = "Name";
        } 
        
      }

      if (selectedItem.key == "assignee") {
        let updatedSearchList = advancedFilter.filter(
          (x) => x.key != selectedItem.key
        );
        setAdvancedFilter(updatedSearchList);
        // Reset Search Bar
        if (editedByRef.current != null){
          editedByRef.current.value = null;
          editedByRef.current.placeholdertext = "In Use By";
        }
      }

      filteredArr.splice(index, 1);

      dispatch(setFilterListSearchParams(filteredArr));
    }
  };

  const clearAllFilters = () => {

    // Top Level Filters
    staffGroupRef.current.value = "";
    documentStatusRef.current.value = "";
    criminalStatusRef.current.value = "";
    searchRef.current.value = "";
    searchRef.current.placeholdertext = "Name";
    documentTypeRef.current.value = "";
    

    // Advanced Filters
    if (fileNumberRef.current != null){
    fileNumberRef.current.value = "";
    fileNumberRef.current.placeholdertext = "File #";
    }

    if (lawyerNameRef.current != null){
    lawyerNameRef.current.value = ""
    lawyerNameRef.current.placeholdertext = "Lawyer Name";
    }

    if (editedByRef.current != null){
    editedByRef.current.value = "";
    editedByRef.current.placeholdertext = "In Use By";
    }

    setNextAppearanceEndDate(null);
    setNextAppearanceStartDate(null);

    setStartDate(null);
    setEndDate(null);

    setTopLevelFilter([]);
    setAdvancedFilter([]);
    dispatch(setFilterListSearchParams([]));
  }


  return (
    <div className="filter-main ml-0">
      <div className="row my-3 top-level-filter-container">
          <div className="col-2">
            <DropdownFilter
              label="Responsiblity"
              controlRef={staffGroupRef}
              options={staffGroup}
            ></DropdownFilter>
          </div>
          <div className="col-2">
            <DropdownFilter
              label="Document Status"
              controlRef={documentStatusRef}
              options={documentStatusOptions}
            ></DropdownFilter>
          </div>
          <div className="col-2">
            <DropdownFilter
              label="Criminal Matter"
              controlRef={criminalStatusRef}
              options={crimalStatusOptions}
            ></DropdownFilter>
          </div>
          <div className="col-2">
            <TextSearch
              placeholdertext="Name"
              searchRef={searchRef}
              handleClick={applyTopLevelFilter}
              label="Party Name"
            ></TextSearch>
          </div>
          <div className="col-2">
            <DropdownFilter
              label="Document Type"
              controlRef={documentTypeRef}
              options={documentType}
            ></DropdownFilter>
          </div>
          <div className="col btn-container left">
            <button
              className="BC-Gov-SecondaryButton btn-top-level"
              onClick={() => {
                clearAllFilters();
              }}
            >
              Clear
            </button>
          </div>
          <div className="col btn-container">
            <button
              className="BC-Gov-PrimaryButton btn-top-level"
              onClick={() => {
                applyTopLevelFilter();
              }}
            >
              Apply
            </button>
          </div>
      </div>
      <div className="filter-print-btn-area">
        <input
          type="button"
          className="BC-Gov-PrimaryButton"
          value="Additional Searches and Filters"
          id="html2canvas-ignore-element"
          onClick={handleAdvancedShowFilters}
        ></input>
        <button
          className="BC-Gov-SecondaryButton print-btn"
          id="html2canvas-ignore-element"
          onClick={printPDFCallback}
        >
          <i class="fa fa-print  mx-1"></i>Print to PDF
        </button>
      </div>
      <div className="filterDiv">
        <Filters handleDeleteFilter={handleDeleteFilter}></Filters>
      </div>
      <Modal show={showAdvancedFilters} onHide={handleAdvancedShowFilters} keyboard={false}>
        <Modal.Header closeButton className="btn-primary modal-header-custom">
          <Modal.Title>Additional Searches and Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="col 12">
          <div className="row advanced-div">
              <TextSearch
                placeholdertext="File #"
                searchRef={fileNumberRef}
                label="Court/Tribunal File #"
              ></TextSearch>
          </div>
          <div className="row advanced-div">
              <TextSearch
                placeholdertext="Lawyer Name"
                searchRef={lawyerNameRef}
                label="Lawyer Name"
              ></TextSearch>
          </div>
          <div className="row advanced-div">
              <TextSearch
                placeholdertext="In Use By"
                searchRef={editedByRef}
                label="In Use By"
              ></TextSearch>
          </div>
          </div>
          <div className="row mb-2">
            <div className="col-12">
              <div className="mx-2">
                <b>Serve Date</b>
              </div>
              <div className="row mx-1">
                <div className="col-6">
                  <div>From:</div>
                  <DatePicker
                    className="form-control"
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setEndDate(date);
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
                <div className="col-6">
                  <div>To:</div>
                  <DatePicker
                    className="form-control"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-12">
              <div className="mx-2">
                <b>Next Apperance Date</b>
              </div>
              <div className="row mx-1">
                <div className="col-6">
                  <div>From:</div>
                  <DatePicker
                    className="form-control"
                    selected={nextAppearanceStartDate}
                    onChange={(date) => {
                      setNextAppearanceEndDate(date);
                      setNextAppearanceStartDate(date);
                    }}
                    selectsStart
                    startDate={nextAppearanceStartDate}
                    endDate={nextAppearanceEndDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
                <div className="col-6">
                  <div>To:</div>
                  <DatePicker
                    className="form-control"
                    selected={nextAppearanceEndDate}
                    onChange={(date) => setNextAppearanceEndDate(date)}
                    selectsEnd
                    startDate={nextAppearanceStartDate}
                    endDate={nextAppearanceEndDate}
                    minDate={nextAppearanceStartDate}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAdvancedShowFilters}>
            Close
          </Button>
          <Button
            variant="primary"
            className="buttonColor"
            onClick={() => {
              handleAdvancedShowFilters();
              applyAdvancedFilter();
            }}
          >
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default TaskFilter;
