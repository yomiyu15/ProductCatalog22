import React, { useState } from "react";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfViewer = ({ file }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Ensure the worker version matches the pdfjs version */}
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={file}
          onLoadSuccess={onLoadSuccess}
          pageIndex={pageNumber - 1}
        />
      </Worker>

      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)" }}>
        <button onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}>Prev</button>
        <span>{`Page ${pageNumber} of ${numPages}`}</span>
        <button onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages))}>Next</button>
      </div>
    </div>
  );
};

export default PdfViewer;
