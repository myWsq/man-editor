import { StorageAdapter } from "../storage-adapter";
import LocalForage from "localforage";

export interface StorageAdapterIndexedDbOptions {
  dbName: string;
}

export class StorageAdapterIndexedDb extends StorageAdapter {
  private client: LocalForage;

  constructor(options: StorageAdapterIndexedDbOptions) {
    super();
    this.client = LocalForage.createInstance({
      name: options.dbName,
      driver: LocalForage.INDEXEDDB,
      description: "editor_indexed_db_adapter",
    });
  }

  public getItem(key: string): Promise<Blob | string | null> {
    return this.client.getItem(key);
  }
  public async setItem(key: string, value: string | Blob) {
    await this.client.setItem(key, value);
  }
}
