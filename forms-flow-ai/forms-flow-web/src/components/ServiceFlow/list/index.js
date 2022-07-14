import React from "react";
import ServiceFlowTaskList from "./ServiceTaskList";
import { Container } from "react-bootstrap";
import "../ServiceFlow.scss";

import TaskFilter from "../TaskFilter";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";

const TaskList = React.memo(() => {

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

  return (
    <Container fluid id="main">
      <section>
        <TaskFilter printPDFCallback={printTableToPDF} />
        <ServiceFlowTaskList/>
      </section>
    </Container>
  );
});

export default TaskList;