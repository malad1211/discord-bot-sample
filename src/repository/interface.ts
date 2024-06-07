import { Platform } from "../enum/platform";
import { UseStat } from "../entity/use_stat";
import { User } from "../entity/user";

// placeholder interface, just use typeorm instead
export interface IRepository {
  getUser(platform: Platform, identifier: string): Promise<User>;
  getOrInsertUser(platform: Platform, identifier: string): Promise<User>;
  saveUseStat(
    userID: string,
    serviceCode: string,
    imageURL: string,
    output: string,
  ): Promise<UseStat>;
  listUsers(): Promise<User[]>;
  listUseStats(userID: string): Promise<UseStat[]>;
  stop(): Promise<void>;
}

export const UserNotFoundErr = new Error("user not found");
