import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

// initialize the s3
export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      // after confirming the aws object, confirm the s3 object

      const s3 = new S3({
        region: "eu-west-2",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
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
      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          return resolve({
            file_key,
            file_name: file.name,
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

// access url of the file so we can embed the file in our app
export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.s3.eu-west-2.amazonaws.com/${file_key}`;
  return url;
}
