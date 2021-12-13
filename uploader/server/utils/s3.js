const AWS = require("aws-sdk");

class S3 {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET,
    });
  }

  async exists(bucket, key) {
    const existsInS3 = await this.s3
      .headObject({
        Bucket: bucket,
        Key: key,
      })
      .promise()
      // eslint-disable-next-line github/no-then
      .then(
        () => true,
        (err) => {
          if (err.code === "NotFound") {
            return false;
          }
          throw err;
        }
      );
    return existsInS3;
  }

  async get(bucket, key) {
    const getRes = await this.s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
    return getRes;
  }

  async remove(bucket, key) {
    const removeRes = await this.s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
    return removeRes;
  }

  async removeFolder(bucketName, folder) {
    let params = {
      Bucket: bucketName,
      Prefix: folder,
    };

    const data = await this.s3.listObjects(params).promise();
    if (data.Contents.length === 0) {
      // eslint-disable-next-line no-console
      console.log("No items in folder looking to be deleted: ", folder);
      throw new Error(`Folder not found, ${folder}`);
    }
    params = { Bucket: bucketName };
    params.Delete = { Objects: [] };
    for (const content of data.Contents) {
      params.Delete.Objects.push({ Key: content.Key });
    }

    return this.s3.deleteObjects(params).promise();
  }

  async upload(obj) {
    const uploadRes = await this.s3.upload(obj).promise();
    return uploadRes;
  }
}

module.exports = S3;
