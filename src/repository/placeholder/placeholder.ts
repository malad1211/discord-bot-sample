import { IRepository } from "../interface";
import { Platform } from "../../enum/platform";
import { User } from "../../entity/user";
import { UseStat } from "../../entity/use_stat";

export class PlaceholderRepository implements IRepository {
  public async getUser(platform: Platform, identifier: string): Promise<User> {
    return Promise.resolve(new User());
  }

  public async getOrInsertUser(
    platform: Platform,
    identifier: string,
  ): Promise<User> {
    return Promise.resolve(new User());
  }

  public async saveUseStat(
    userID: string,
    serviceCode: string,
    imageURL: string,
    output: string,
  ): Promise<UseStat> {
    return Promise.resolve(new UseStat());
  }

  public async listUsers(): Promise<User[]> {
    return Promise.resolve([]);
  }

  public async listUseStats(userID: string): Promise<UseStat[]> {
    return Promise.resolve([]);
  }

  public async stop(): Promise<void> {
    return;
  }
}
