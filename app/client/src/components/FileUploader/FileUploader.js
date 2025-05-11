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
import { S3 } from "aws-sdk";
import React, { useEffect, useRef, useState } from "react";
import "./FileUploader.css";

const FileUploader = ({ files, onUploadComplete }) => {
  const [uploading, setUploading] = useState(true); // Track if files are being uploaded
  const [fileStatuses, setFileStatuses] = useState([]); // Track file statuses and progress
  const [setCompletedCount] = useState(0); // Track number of completed uploads
  const callbackCalledRef = useRef(false); // Prevent multiple callback calls

  const s3 = new S3({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  // Function to upload a file to S3
  const uploadFile = (file, index) => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
        Key: `uploads/${file.s3Url}`,
        Body: file.file,
        ContentType: file.file.type,
      };

      const upload = s3.upload(params);

      // Set initial status to "uploading"
      setFileStatuses((prevStatuses) => {
        const newStatuses = [...prevStatuses];
        newStatuses[index] = { status: "uploading", progress: 0 };
        return newStatuses;
      });

      // Track upload progress
      upload.on("httpUploadProgress", (event) => {
        const progress = Math.round((event.loaded / event.total) * 100);

        // Update progress as it happens
        setFileStatuses((prevStatuses) => {
          const newStatuses = [...prevStatuses];
          // Only update the progress value if it is different from the last progress
          if (newStatuses[index].progress !== progress) {
            newStatuses[index] = { ...newStatuses[index], progress };
          }
          return newStatuses;
        });
      });

      // Complete or error handling
      upload.send((err, data) => {
        const status = err ? "error" : "uploaded";
        setFileStatuses((prevStatuses) => {
          const newStatuses = [...prevStatuses];
          newStatuses[index] = { status, progress: 100 }; // 100% progress when finished
          return newStatuses;
        });

        if (err) {
          reject(err); // Reject if an error occurs
        } else {
          resolve(data); // Resolve when upload is successful
        }
      });
    });
  };

  // Start uploading files sequentially
  const startUploading = async () => {
    try {
      setUploading(true);
      let tempCompletedCount = 0; // Track completed uploads locally

      for (let i = 0; i < files.length; i++) {
        // If any file fails, stop the upload process immediately
        await uploadFile(files[i], i);
        tempCompletedCount++; // Increment completed uploads outside the state
      }

      // Set the completed count after all files are uploaded
      setCompletedCount(tempCompletedCount);

      // After all uploads are completed, finalize the callback
      if (!callbackCalledRef.current) {
        callbackCalledRef.current = true;
        setUploading(false); // All uploads completed

        // const uploadedCount = fileStatuses.filter((status) => status.status === 'uploaded').length;
        const errorCount = fileStatuses.filter(
          (status) => status.status === "error"
        ).length;

        if (onUploadComplete) {
          if (errorCount === 0) {
            onUploadComplete(true); // All files uploaded successfully
          } else {
            onUploadComplete(false); // Some files failed
          }
        }
      }
    } catch (error) {
      console.error("File upload stopped due to error:", error);
      if (!callbackCalledRef.current) {
        callbackCalledRef.current = true;
        setUploading(false); // Stop uploading

        if (onUploadComplete) {
          onUploadComplete(false); // Callback with failure due to error
        }
      }
    }
  };

  // Trigger uploading when files prop changes (only once per change)
  useEffect(() => {
    if (files.length > 0 && !callbackCalledRef.current) {
      setFileStatuses(files.map(() => ({ status: "pending", progress: 0 }))); // Initialize statuses
      startUploading(); // Start the upload process
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]); // This will trigger only when `files` changes

  return (
    <div className="file-uploader-container">
      <Typography variant="h6">File Upload</Typography>

      {/* Display file status in a table */}
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

      {/* Show the number of successful and failed uploads */}
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
