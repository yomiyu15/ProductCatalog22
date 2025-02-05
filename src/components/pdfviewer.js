import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";

const PDFViewer = ({ file }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh", // Full height to match the page
        overflow: "auto", // Ensures window scrollbar is used
      }}
    >
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={file}
          defaultScale={window.innerWidth < 768 ? 0.7 : 1} // Adjust scale for mobile
          renderMode="canvas"
        />
      </Worker>
    </div>
  );
};

export default PDFViewer;
