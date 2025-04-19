import AWS from 'aws-sdk';
import React, { useEffect, useState } from 'react';
import ShortUniqueId from 'short-unique-id';
import FileUploadSection from '../FileUploadSection/FileUploadSection';
import './UploadPage.scss';
import { Link } from 'react-router-dom';

const UploadPage = () => {
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

        const S3_BUCKET = process.env.REACT_APP_AWS_S3_BUCKET;
        const REGION = process.env.REACT_APP_AWS_REGION;

        AWS.config.update({
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
            region: REGION,
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
        <div className="wrapper">
            {hasUploaded && folderId && (
                <div className="upload-success">
                    <h2>Files Uploaded Successfully!</h2>
                    <p>Your unique ID is: {folderId}</p>
                    <Link to={`/${folderId}`}>View Uploaded Files</Link>
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
                hasUploaded={hasUploaded}
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
                hasUploaded={hasUploaded}
                emptyRows={0}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <button
                    onClick={uploadFile}
                    disabled={loading || hasUploaded || (beforeFiles.length === 0 && afterFiles.length === 0)}
                    className={`upload-button ${
                        loading || hasUploaded || (beforeFiles.length === 0 && afterFiles.length === 0)
                            ? 'disabled'
                            : 'enabled'
                    }`}
                >
                    {loading ? 'Uploading...' : hasUploaded ? 'Uploaded' : 'Upload All Files'}
                </button>
            </div>
        </div>
    );
};

export default UploadPage;