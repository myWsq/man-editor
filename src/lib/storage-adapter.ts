import { STORAGE_KEY } from "../consts/storage-key";
import { guard } from "../utils/guard";

export abstract class StorageAdapter {
  public async check() {
    const checkValue = "ok";
    await this.setItem(STORAGE_KEY.healthCheck, checkValue);
    const val = await this.getItem(STORAGE_KEY.healthCheck);
    guard(
      val?.toString() === checkValue,
      `期望值: '${checkValue}', 实际值: '${val}'`
    );
  }
  public abstract getItem(
    key: string
  ): Promise<string | Blob | Uint8Array | null>;
  public abstract setItem(key: string, value: string | Blob): Promise<void>;
}
