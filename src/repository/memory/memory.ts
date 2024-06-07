import { IRepository, UserNotFoundErr } from "../interface";
import { Platform } from "../../enum/platform";
import { User } from "../../entity/user";
import { UseStat } from "../../entity/use_stat";

// just a mock in-memory implementation, please use a proper database
export class MemoryRepository implements IRepository {
  private memoryStorage: {
    userIDCount: number;
    useStateIDCount: number;
    userMap: Map<string, User>;
    useStatMap: Map<string, UseStat>;
    userUseStatMap: Map<string, UseStat[]>;
  };

  public constructor() {
    this.memoryStorage = {
      userIDCount: 1,
      useStateIDCount: 1,
      userMap: new Map(),
      useStatMap: new Map(),
      userUseStatMap: new Map(),
    };
  }

  public async getUser(platform: Platform, identifier: string): Promise<User> {
    const user = this.memoryStorage.userMap.get(
      this.keyUser({
        id: "",
        platform: platform,
        platformIdentifier: identifier,
      }),
    );
    if (user == null) {
      Promise.reject(UserNotFoundErr);
    }
    return Promise.resolve(user);
  }

  public async getOrInsertUser(
    platform: Platform,
    identifier: string,
  ): Promise<User> {
    const user = new User();
    user.platform = platform;
    user.platformIdentifier = identifier;
    const userKey = this.keyUser(user);
    if (this.memoryStorage.userMap.has(userKey)) {
      return Promise.resolve(this.memoryStorage.userMap.get(userKey));
    }

    const id = this.memoryStorage.userIDCount++;
    user.id = id.toString();
    this.memoryStorage.userMap.set(userKey, user);

    this.memoryStorage.userUseStatMap.set(user.id, []);

    return Promise.resolve(user);
  }

  public async saveUseStat(
    userID: string,
    serviceCode: string,
    imageURL: string,
    output: string,
  ): Promise<UseStat> {
    const useStat = new UseStat();
    useStat.userID = userID;
    useStat.serviceCode = serviceCode;
    useStat.imageURL = imageURL;
    useStat.output = output;
    const useStatKey = this.keyUseStat(useStat);

    if (this.memoryStorage.useStatMap.has(useStatKey)) {
      return Promise.resolve(this.memoryStorage.useStatMap.get(useStatKey));
    }

    const id = this.memoryStorage.useStateIDCount++;
    useStat.id = id.toString();
    this.memoryStorage.useStatMap.set(useStatKey, useStat);

    this.memoryStorage.userUseStatMap.get(userID).push(useStat);

    return Promise.resolve(useStat);
  }

  public async listUsers(): Promise<User[]> {
    const list = Array.from(this.memoryStorage.userMap.values());
    return Promise.resolve(list);
  }

  public async listUseStats(userID: string): Promise<UseStat[]> {
    const list = this.memoryStorage.userUseStatMap.get(userID);
    if (list == null) {
      return Promise.resolve([]);
    }

    return Promise.resolve(list);
  }

  private keyUser(user: User): string {
    return `${user.platform}-${user.platformIdentifier}`;
  }

  private keyUseStat(useStat: UseStat): string {
    return `${useStat.userID}-${useStat.serviceCode}-${useStat.imageURL}`;
  }

  public async stop(): Promise<void> {
    this.memoryStorage = null;
    return;
  }
}
