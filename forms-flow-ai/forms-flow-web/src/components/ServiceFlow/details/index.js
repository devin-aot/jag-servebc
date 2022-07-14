import React from "react";
import ServiceFlowTaskDetails from "../details/ServiceTaskDetails";
import { Container, Button } from "react-bootstrap";
import "../ServiceFlow.scss";

import {Link} from "react-router-dom";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

const TaskDetails =  React.memo(() => {

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
      <div className="container-task-view">
          <div className="task-view-top">

            <Link className="remove_button_css" to="/task">
              <i className="fa fa-angle-left"/>
              {"  "} Back to search results
            </Link>

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
            <ServiceFlowTaskDetails id="main"/>
          </Container>
        </div>
    </Container>
  );
});

export default TaskDetails;