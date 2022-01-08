import S3 from "aws-sdk/clients/s3";
import { StorageAdapter } from "../storage-adapter";

export interface StorageAdapterS3Options {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export class StorageAdapterS3 extends StorageAdapter {
  private client: S3;

  constructor(options: StorageAdapterS3Options) {
    super();
    this.client = new S3({
      endpoint: options.endpoint,
      s3BucketEndpoint: true,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  public async getItem(key: string): Promise<Blob | string | null> {
    const result = await this.client
      .getObject({
        Bucket: "Ignore",
        Key: key,
      })
      .promise();

    return (result.Body as Blob | string) || null;
  }
  public async setItem(key: string, value: string | Blob) {
    await this.client
      .putObject({
        Bucket: "Ignore",
        Key: key,
        Body: value,
      })
      .promise();
  }
}
