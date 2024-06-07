import {
    SlashCommandBuilder,
    Interaction,
    ChatInputCommandInteraction,
  } from "discord.js";
  import { IRepository } from "../../../repository/interface";
  import { PLATFORM } from "./_global";
  
  export class ListUserCommand {
    public data: SlashCommandBuilder;
    private repository: IRepository;
  
    public constructor(params: { repository: IRepository }) {
      this.repository = params.repository;
      this.data = new SlashCommandBuilder()
        .setName("listuser")
        .setDescription("List process image users.");
    }
  
    public async execute(interaction: ChatInputCommandInteraction) {
      const list = await this.repository.listUsers();
  
      await interaction.reply(JSON.stringify(list, null, 1));
    }
  
    public register(commands) {
      commands.set(this.data.name, this);
    }
  }
  