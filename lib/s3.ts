import AWS from "aws-sdk";

// initialize the s3
export async function uploadToS3(file: File) {
  try {
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
    // file-key variable -> to make sure the file key is always unique
    // basically, upload to upload folder within AWS S3, give it a unique name, and replace spaces with hyphens
    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
    // define params to pass to upload
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };
    // define the upload file, use 'on' to monitor progress of upload
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (event) => {
        console.log(
          "Uploading to S3...",
          parseInt(((event.loaded * 100) / event.total).toString())
        ) + "% ";
      })
      .promise();
    // callback then will be called when upload is

    await upload.then((data) => {
      console.log("Successfully uploaded to S3!", file_key);
    });
    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {
    console.log("Error uploading file-> ", error);
  }
}
// access url of the file so we can embed the file in our app
export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-west-2.amazonaws.com/${file_key}`;
  return url;
}
