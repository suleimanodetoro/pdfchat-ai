// This file will only run on the server
import AWS from "aws-sdk";
// import fs to use file system to download file
import fs from "fs"
export async function downloadFromS3(file_key: string) {
  try {
    // initialize the s3 bucket
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });
    // after confirming the aws object, confirm the s3 object
    const s3 = new AWS.S3({
      params: {
        // remember the bucket name you created ? ->
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: "eu-west-2",
    });

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    //   get objet from s3
    const obj = await s3.getObject(params).promise();
    // download file
    // file_name is where you want to the file to be kept in local folder
    const file_name = `/tmp/pdf-${Date.now()}.pdf`
    // download into our file system
    fs.writeFileSync(file_name, obj.Body as Buffer);
    return file_name;
  } catch (error) {
    console.log(error);
    return null;
  }
}
