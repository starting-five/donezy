const express = require("express");
const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.post("/presign", async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${filename}`,
      ContentType: contentType,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate presigned URL" });
  }
});

router.get("/list-images", async (req, res) => {
    const { postId, section } = req.query;

    try {
      const prefix = `uploads/${postId}/${section}/`;

      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.AWS_S3_BUCKET,
        Prefix: prefix,
      });

      const data = await s3.send(listCommand);

      const images = await Promise.all(
        (data.Contents || []).map(async (item) => ({
          url: await getSignedUrl(
            s3,
            new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              Key: item.Key,
            }),
            { expiresIn: 3600 }
          ),
        }))
      );
      res.json({ images });
    } catch (err) {
      res.status(500).json({ error: "Could not list images" });
    }
  });

module.exports = router;