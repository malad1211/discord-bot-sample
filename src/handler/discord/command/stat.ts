import {
  SlashCommandBuilder,
  Interaction,
  ChatInputCommandInteraction,
} from "discord.js";
import { IRepository } from "../../../repository/interface";
import { PLATFORM } from "./_global";

export class StatCommand {
  public data: SlashCommandBuilder;
  private repository: IRepository;

  public constructor(params: { repository: IRepository }) {
    this.repository = params.repository;
    this.data = new SlashCommandBuilder()
      .setName("stat")
      .setDescription("List image process use stat.");
  }

  public async execute(interaction: ChatInputCommandInteraction) {
    const user = await this.repository.getOrInsertUser(
      PLATFORM,
      interaction.member.user.id,
    );
    const useStatList = await this.repository.listUseStats(user.id);

    const list: any[] = [user];
    list.push(useStatList);

    await interaction.reply(JSON.stringify(list, null, 1));
  }

  public register(commands) {
    commands.set(this.data.name, this);
  }
}
