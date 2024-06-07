import "dotenv/config";
import { IRepository } from "./repository/interface";
import { MemoryRepository } from "./repository/memory/memory";
import { Platform } from "./enum/platform";
import { IImageService } from "./service/image/interface";
import { PlaceholderImageService } from "./service/image/placeholder/placeholder";
import { DiscordHandler } from "./handler/discord/discord";
import { StatImageService } from "./service/image/stat/stat";
import { Buffer } from "buffer";

const gracefulShutdown: (() => Promise<void>)[] = [];

async function main() {
  console.log("test");

  const repository: IRepository = new MemoryRepository();
  const imageService: IImageService = new StatImageService();

  // let user = await repository.getOrInsertUser(Platform.DISCORD, "1");
  // user = await repository.getOrInsertUser(Platform.DISCORD, "1");
  // user = await repository.getOrInsertUser(Platform.DISCORD, "2");
  // user = await repository.getOrInsertUser(Platform.DISCORD, "3");
  // user = await repository.getOrInsertUser(Platform.DISCORD, "1");
  // user = await repository.getOrInsertUser(Platform.DISCORD, "4");
  // console.log(`test repository: ${JSON.stringify(user, null, 2)}`);

  // let output = await imageService.processImage(null);
  // output = await imageService.processImage(null);
  // console.log(`test service: ${output}`);

  const discordHandler = new DiscordHandler({
    repository: repository,
    imageServiceList: [imageService],
  });

  gracefulShutdown.push(async () => {
    // console.log("test graceful shutdown");
    await discordHandler.stop();
    await imageService.stop();
    await repository.stop();
  });

  // let imageURL =
  //   "https://cdn.discordapp.com/ephemeral-attachments/1248581257286127668/1248593220439642242/black.png?ex=66643a8d&is=6662e90d&hm=d867403d8f02b6d6a628ac4acf40b93065f2a7006855d92b5a5f375f07dffa1e&";
  // let response = await fetch(imageURL);
  // let buffer = Buffer.from(await response.arrayBuffer());
  // let output = await imageService.processImage(buffer);
  // console.log(buffer);
  // console.log(output);

  await discordHandler.start({
    botToken: process.env["DISCORD_BOT_TOKEN"],
    applicationID: process.env["DISCORD_BOT_APPLICATION_ID"],
    deployCommands: false,
  });
}

async function shutdown() {
  for (const element of gracefulShutdown) {
    await element().catch(e => {
      console.log(e);
    });
  }
  process.exit(0);
}

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received.");
  shutdown();
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received.");
  shutdown();
});

main().catch(async e => {
  console.log(e);
  await shutdown();
});
