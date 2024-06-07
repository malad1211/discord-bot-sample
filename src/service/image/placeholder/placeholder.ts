import { IImageService } from "../interface";
import { Buffer } from "buffer";

export class PlaceholderImageService implements IImageService {
  public getServiceCode(): string {
    return "PLACEHOLDER";
  }

  public async processImage(image: Buffer): Promise<string> {
    return Promise.resolve("placeholder");
  }

  public async stop(): Promise<void> {
    return;
  }
}
