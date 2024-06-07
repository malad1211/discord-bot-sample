import { IImageService } from "../interface";
import { Buffer } from "buffer";
import sharp from "sharp";

export class StatImageService implements IImageService {
  public getServiceCode(): string {
    return "STAT";
  }

  public async processImage(image: Buffer): Promise<string> {
    const sharpImage = await sharp(image);
    const imageStats = await sharpImage.stats();
    await sharpImage.destroy();
    return Promise.resolve(JSON.stringify(imageStats));
  }

  public async stop(): Promise<void> {
    return;
  }
}
