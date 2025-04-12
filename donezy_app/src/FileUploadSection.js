import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import byteSize from 'byte-size';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the Delete icon

const FileUploadSection = ({ title, onFilesChange, fileStatuses, loading, emptyRows = 0 }) => {
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
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                boxSizing: 'border-box',
                marginBottom: '16px',
            }}
        >
            <TableContainer
                component={Card}
                sx={{
                    width: '650px',
                    margin: '0 auto',
                    padding: '16px',
                    boxShadow: 'none',
                }}
            >
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={4} align="center" style={{ fontWeight: 'bold' }}>
                                {title}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ width: '35%' }}>File Name</TableCell>
                            <TableCell style={{ width: '25%' }}>File Size</TableCell>
                            <TableCell style={{ width: '25%' }}>Status</TableCell>
                            <TableCell style={{ width: '15%' }}>Actions</TableCell>
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
                                            onClick={() => handleRemoveFile(index)}
                                            sx={{
                                                color: 'black', // Set the icon color to black
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {/* Add empty rows if no files */}
                        {files.length === 0 &&
                            Array.from({ length: emptyRows }).map((_, index) => (
                                <TableRow key={`empty-${index}`}>
                                    <TableCell colSpan={4} style={{ textAlign: 'center', color: '#aaa' }}>
                                        Empty Row
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <label
                style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: loading ? '#6c757d' : '#007bff',
                    color: '#fff',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '16px',
                }}
            >
                Select Files
                <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    disabled={loading}
                    style={{ display: 'none' }}
                />
            </label>
        </div>
    );
};

export default FileUploadSection;