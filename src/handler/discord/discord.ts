import {
  Client,
  Events,
  GatewayIntentBits,
  ClientApplication,
  Collection,
  GuildResolvable,
  ApplicationCommandManager,
  REST,
  Routes,
} from "discord.js";
import { PingCommand } from "./command/ping";
import { IRepository } from "../../repository/interface";
import { IImageService } from "../../service/image/interface";
import { ProcessImageCommand } from "./command/process_image";
import { StatCommand } from "./command/stat";
import { ListUserCommand } from "./command/list_users";

export class DiscordHandler {
  private client;
  private repository: IRepository;

  public constructor(params: {
    repository: IRepository;
    imageServiceList: IImageService[];
  }) {
    this.client = new Client({
      intents: [GatewayIntentBits.MessageContent],
    });
    this.repository = params.repository;

    this.client.once(Events.ClientReady, readyClient => {
      console.log(`Discord bot ready! Logged in as ${readyClient.user.tag}`);
    });

    this.client.commands = new Collection();

    new PingCommand().register(this.client.commands);

    new ProcessImageCommand({
      repository: params.repository,
      imageServiceList: params.imageServiceList,
    }).register(this.client.commands);

    new ListUserCommand({
      repository: params.repository,
    }).register(this.client.commands);

    new StatCommand({
      repository: params.repository,
    }).register(this.client.commands);
  }

  public async start(params: {
    botToken: string;
    applicationID: string;
    deployCommands?: boolean;
  }) {
    this.client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return;

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`,
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    });

    if (params.deployCommands) {
      const rest = new REST().setToken(params.botToken);
      const commands = [];
      for (const [k, v] of this.client.commands as Collection<string, any>) {
        const commandData = v.data.toJSON();
        console.log(`${k} : ${JSON.stringify(commandData)}`);
        commands.push(commandData);
      }
      await rest.put(Routes.applicationCommands(params.applicationID), {
        body: commands,
      });
      console.log("Done deploy discord commands");
    }

    await this.client.login(params.botToken);
  }

  public async stop() {
    console.log("Stopping discord bot");
    await (this.client as Client).removeAllListeners();
    console.log("Stopped discord bot");
  }
}
