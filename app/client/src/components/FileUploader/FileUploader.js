// File: client/src/components/FileUploader/FileUploader.js
// Description: This file contains the FileUploader component which is used to upload files to AWS S3.

import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./FileUploader.css";

const FileUploader = ({ files, onUploadComplete }) => {
  const [uploading, setUploading] = useState(true); // Track if files are being uploaded
  const [fileStatuses, setFileStatuses] = useState([]); // Track file statuses and progress
  // eslint-disable-next-line no-unused-vars
  const [completedCount, setCompletedCount] = useState(0); // Track number of completed uploads
  const callbackCalledRef = useRef(false); // Prevent multiple callback calls

  // Function to get a presigned URL from your backend
  const getPresignedUrl = async (file) => {
    const res = await fetch("http://localhost:4000/api/s3/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.s3Url,
        contentType: file.file.type,
      }),
    });
    const data = await res.json();
    return data.url;
  };

  // Function to upload a file to S3 using the presigned URL
  const uploadFile = async (file, index) => {
    setFileStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      newStatuses[index] = { status: "uploading", progress: 0 };
      return newStatuses;
    });

    try {
      const presignedUrl = await getPresignedUrl(file);

      // Use fetch to PUT the file to S3
      const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.file.type,
        },
        body: file.file,
      });

      if (!response.ok) throw new Error("Upload failed");

      setFileStatuses((prevStatuses) => {
        const newStatuses = [...prevStatuses];
        newStatuses[index] = { status: "uploaded", progress: 100 };
        return newStatuses;
      });
      return true;
    } catch (err) {
      setFileStatuses((prevStatuses) => {
        const newStatuses = [...prevStatuses];
        newStatuses[index] = { status: "error", progress: 100 };
        return newStatuses;
      });
      return false;
    }
  };

  // Start uploading files sequentially
  const startUploading = async () => {
    try {
      setUploading(true);
      let tempCompletedCount = 0; // Track completed uploads locally

      for (let i = 0; i < files.length; i++) {
        await uploadFile(files[i], i);
        tempCompletedCount++; // Increment completed uploads outside the state
      }

      setCompletedCount(tempCompletedCount);

      if (!callbackCalledRef.current) {
        callbackCalledRef.current = true;
        setUploading(false);

        const errorCount = fileStatuses.filter(
          (status) => status.status === "error"
        ).length;

        if (onUploadComplete) {
          if (errorCount === 0) {
            onUploadComplete(true);
          } else {
            onUploadComplete(false);
          }
        }
      }
    } catch (error) {
      console.error("File upload stopped due to error:", error);
      if (!callbackCalledRef.current) {
        callbackCalledRef.current = true;
        setUploading(false);

        if (onUploadComplete) {
          onUploadComplete(false);
        }
      }
    }
  };

  useEffect(() => {
    if (files.length > 0 && !callbackCalledRef.current) {
      setFileStatuses(files.map(() => ({ status: "pending", progress: 0 })));
      startUploading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    if (!uploading && fileStatuses.length === files.length && !callbackCalledRef.current) {
      callbackCalledRef.current = true;
      const errorCount = fileStatuses.filter((status) => status.status === "error").length;
      if (onUploadComplete) {
        onUploadComplete(errorCount === 0);
      }
    }
  }, [uploading, fileStatuses, files.length, onUploadComplete]);

  return (
    <div className="file-uploader-container">
      <Typography variant="h6">File Upload</Typography>
      <TableContainer className="file-uploader-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Filename</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file, index) => (
              <TableRow key={index}>
                <TableCell>{file.file.name}</TableCell>
                <TableCell>{(file.file.size / 1024).toFixed(2)} KB</TableCell>
                <TableCell>
                  {fileStatuses[index]?.status === "uploading" && (
                    <LinearProgress
                      variant="determinate"
                      value={fileStatuses[index]?.progress}
                      sx={{ width: "100%", marginTop: "8px" }}
                    />
                  )}
                  {fileStatuses[index]?.status === "uploaded" && (
                    <Typography className="file-uploader-success">Uploaded</Typography>
                  )}
                  {fileStatuses[index]?.status === "error" && (
                    <Typography className="file-uploader-error">Error</Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!uploading && (
        <div>
          <Typography variant="body2" className="file-uploader-success">
            {
              fileStatuses.filter((status) => status.status === "uploaded")
                .length
            }{" "}
            file(s) uploaded successfully.
          </Typography>
          <Typography variant="body2" className="file-uploader-error">
            {fileStatuses.filter((status) => status.status === "error").length}{" "}
            file(s) failed to upload.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
