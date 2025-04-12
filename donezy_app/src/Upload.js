import React, { useState, useEffect } from 'react';
import FileUploadSection from './FileUploadSection';
import AWS from 'aws-sdk';
import ShortUniqueId from 'short-unique-id';

const Upload = () => {
    const [beforeFiles, setBeforeFiles] = useState([]);
    const [afterFiles, setAfterFiles] = useState([]);
    const [fileStatuses, setFileStatuses] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasUploaded, setHasUploaded] = useState(false);
    const [folderId, setFolderId] = useState('');
    const uuid = new ShortUniqueId({ length: 12 });

    // Reset state on component load
    useEffect(() => {
        setBeforeFiles([]);
        setAfterFiles([]);
    }, []);

    const updateFileStatus = (fileName, status) => {
        setFileStatuses((prevStatuses) => ({
            ...prevStatuses,
            [fileName]: status,
        }));
    };

    const uploadFile = async () => {
        const generatedFolderId = uuid.randomUUID();
        setFolderId(generatedFolderId);
        setLoading(true);
        setHasUploaded(false);

        const beforeFilesWithId = beforeFiles.map((fileObj) => {
            const fileExtension = fileObj.file.name.split('.').pop();
            return {
                file: fileObj.file,
                name: `${generatedFolderId}/before/${uuid.randomUUID()}.${fileExtension}`,
            };
        });

        const afterFilesWithId = afterFiles.map((fileObj) => {
            const fileExtension = fileObj.file.name.split('.').pop();
            return {
                file: fileObj.file,
                name: `${generatedFolderId}/after/${uuid.randomUUID()}.${fileExtension}`,
            };
        });

        const allFiles = [...beforeFilesWithId, ...afterFilesWithId];

        if (allFiles.length === 0) {
            alert('No files selected for upload.');
            setLoading(false);
            return;
        }

        const S3_BUCKET = 'donezy';
        const REGION = 'us-west-1';

        AWS.config.update({
            accessKeyId: 'AKIARXR7OELODM56VL7V',
            secretAccessKey: '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',
        });

        const s3 = new AWS.S3({
            params: { Bucket: S3_BUCKET },
            region: REGION,
        });

        for (const { file, name } of allFiles) {
            updateFileStatus(file.name, 'Uploading');
            const params = {
                Bucket: S3_BUCKET,
                Key: name,
                Body: file,
            };

            try {
                const upload = s3
                    .putObject(params)
                    .on('httpUploadProgress', (evt) => {
                        console.log(
                            `Uploading ${file.name}: ${parseInt((evt.loaded * 100) / evt.total)}%`
                        );
                    })
                    .promise();

                await upload;
                updateFileStatus(file.name, 'Uploaded');
            } catch (err) {
                updateFileStatus(file.name, 'Failed');
            }
        }

        setLoading(false);
        setHasUploaded(true);
    };

    return (
        <div style={styles.wrapper}>
            {hasUploaded && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <h2 style={{ color: 'green' }}>Files Uploaded Successfully!</h2>
                    <p>Your unique ID is: {folderId}</p>
                    <a href={`/${folderId}`} style={{ textDecoration: 'underline', color: 'blue' }}>
                        View Uploaded Files
                    </a>
                </div>
            )}
            <FileUploadSection
                title="Before Pictures"
                onFilesChange={(files) => {
                    console.log('Before Files Updated:', files);
                    setBeforeFiles(files);
                }}
                fileStatuses={fileStatuses}
                loading={loading || hasUploaded}
                emptyRows={0}
            />
            <FileUploadSection
                title="After Pictures"
                onFilesChange={(files) => {
                    console.log('After Files Updated:', files);
                    setAfterFiles(files);
                }}
                fileStatuses={fileStatuses}
                loading={loading || hasUploaded}
                emptyRows={0}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <button
                    onClick={uploadFile}
                    disabled={loading || hasUploaded || (beforeFiles.length === 0 && afterFiles.length === 0)}
                    style={{
                        padding: '16px 32px', // Bigger padding for a larger button
                        fontSize: '18px', // Larger font size
                        backgroundColor: loading || hasUploaded || (beforeFiles.length === 0 && afterFiles.length === 0)
                            ? '#6c757d' // Gray color when disabled
                            : '#28a745', // Green color when enabled
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px', // Slightly more rounded corners
                        cursor: loading || hasUploaded || (beforeFiles.length === 0 && afterFiles.length === 0)
                            ? 'not-allowed' // Disabled cursor
                            : 'pointer', // Pointer cursor when enabled
                        transition: 'background-color 0.3s ease, transform 0.2s ease', // Smooth hover effect
                    }}
                    className="upload-button"
                >
                    {loading ? 'Uploading...' : hasUploaded ? 'Uploaded' : 'Upload All Files'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        border: '2px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        margin: '20px auto',
        maxWidth: '800px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    },
};

export default Upload;