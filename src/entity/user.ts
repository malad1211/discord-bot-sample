import { Platform } from "../enum/platform.js";

// some typeorm decorators for context
// @Entity({name: "users"})
// @Index({"platform", "platformIdentifier"}, {unique: true})
export class User {
  id: string;

  platform: Platform;

  platformIdentifier: string;
}
