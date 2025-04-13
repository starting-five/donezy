import DeleteIcon from '@mui/icons-material/Delete'; // Import the Delete icon
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import byteSize from 'byte-size';
import React, { useState } from 'react';
import './FileUploadSection.scss'; // Import the SCSS file

const FileUploadSection = ({ title, onFilesChange, fileStatuses, loading, hasUploaded, emptyRows = 0 }) => {
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files).map((file) => ({
            file,
            status: 'Selected',
        }));

        setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles, ...newFiles];
            onFilesChange(updatedFiles); // Pass updated files to parent
            return updatedFiles;
        });
    };

    const handleRemoveFile = (indexToRemove) => {
        setFiles((prevFiles) => {
            const updatedFiles = prevFiles.filter((_, index) => index !== indexToRemove);
            onFilesChange(updatedFiles); // Pass updated files to parent
            return updatedFiles;
        });
    };

    return (
        <div className="file-upload-section">
            <TableContainer component={Card} className="table-container">
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={4} className="table-header">
                                {title}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="table-cell file-name">File Name</TableCell>
                            <TableCell className="table-cell file-size">File Size</TableCell>
                            <TableCell className="table-cell file-status">Status</TableCell>
                            <TableCell className="table-cell file-actions">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map((fileObj, index) => {
                            const size = byteSize(fileObj.file.size);
                            const status = fileStatuses[fileObj.file.name] || fileObj.status;
                            return (
                                <TableRow key={index}>
                                    <TableCell>{fileObj.file.name}</TableCell>
                                    <TableCell>{`${size.value} ${size.unit}`}</TableCell>
                                    <TableCell>{status}</TableCell>
                                    <TableCell>
                                        <DeleteIcon
                                            onClick={() => {
                                                if (!hasUploaded) {
                                                    handleRemoveFile(index);
                                                }
                                            }}
                                            className={`delete-icon ${hasUploaded ? 'disabled' : ''}`}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {/* Add empty rows if no files */}
                        {files.length === 0 &&
                            Array.from({ length: emptyRows }).map((_, index) => (
                                <TableRow key={`empty-${index}`}>
                                    <TableCell colSpan={4} className="table-cell empty-row">
                                        Empty Row
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <label
                className={`file-label ${loading ? 'disabled' : ''}`}
            >
                Select Files
                <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    disabled={loading}
                />
            </label>
        </div>
    );
};

export default FileUploadSection;