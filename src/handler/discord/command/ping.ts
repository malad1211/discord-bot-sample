import { SlashCommandBuilder } from "discord.js";

export class PingCommand {
  public data: SlashCommandBuilder;

  public constructor() {
    this.data = new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with Pong!");
  }

  public async execute(interaction) {
    await interaction.reply("Pong!");
  }

  public register(commands) {
    commands.set(this.data.name, this);
  }
}
