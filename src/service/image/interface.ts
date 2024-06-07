import { Buffer } from "buffer";

export interface IImageService {
  getServiceCode(): string;
  processImage(image: Buffer): Promise<string>;
  stop(): Promise<void>;
}
