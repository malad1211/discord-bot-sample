import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
  CommandInteraction,
} from "discord.js";
import { IImageService } from "../../../service/image/interface";
import { PlaceholderImageService } from "../../../service/image/placeholder/placeholder";
import { IRepository } from "../../../repository/interface";
import { PLATFORM } from "./_global";
import { Buffer } from "buffer";

const modeParam = "mode";
const attachmentParam = "attachment";

export class ProcessImageCommand {
  public data: SlashCommandOptionsOnlyBuilder;
  private repository: IRepository;
  private imageServiceList: Map<string, IImageService>;
  private placeholderService: IImageService;

  public constructor(params: {
    repository: IRepository;
    imageServiceList: IImageService[];
  }) {
    this.repository = params.repository;

    this.imageServiceList = new Map();
    const imageServiceCodeList: string[] = [];
    const discordChoiceList = [];
    for (const s of params.imageServiceList) {
      const code = s.getServiceCode();
      this.imageServiceList.set(code, s);
      imageServiceCodeList.push(code);
      discordChoiceList.push({ name: code, value: code });
    }

    this.placeholderService = new PlaceholderImageService();

    this.data = new SlashCommandBuilder()
      .setName("image")
      .setDescription(
        `Process Image. Modes: ${imageServiceCodeList.join(" ; ")}`,
      )
      .addAttachmentOption(option =>
        option
          .setName(attachmentParam)
          .setDescription("Image to process")
          .setRequired(true),
      )
      .addStringOption(option =>
        option
          .setName(modeParam)
          .setDescription("Mode to use")
          .addChoices(discordChoiceList),
      );
  }

  public async execute(interaction: CommandInteraction) {
    const mode = (interaction.options as any).getString(modeParam);

    let imageService = this.imageServiceList.get(mode);
    if (imageService == null) {
      imageService = this.placeholderService;
    }

    const attachment = (interaction.options as any).getAttachment(
      attachmentParam,
    );
    console.log(attachment);
    console.log(JSON.stringify(attachment));
    if ((attachment.contentType as string).search("image") < 0) {
      return await interaction.reply("not an image");
    }

    const imageURL: string = attachment.url;
    const imageResponse = await fetch(imageURL);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const user = await this.repository.getOrInsertUser(
      PLATFORM,
      interaction.member.user.id,
    );
    const output = await imageService.processImage(imageBuffer);
    const useStat = await this.repository.saveUseStat(
      user.id,
      imageService.getServiceCode(),
      imageURL,
      output,
    );

    await interaction.reply(output);
  }

  public register(commands) {
    commands.set(this.data.name, this);
  }
}
