// some typeorm decorators for context
// @Entity({name: "use_stats"})
// @Index({"userID", "serviceCode", "imageURL"}, {unique: true})
export class UseStat {
  id: string;

  userID: string;

  serviceCode: string;

  imageURL: string;

  output: string;
}
