import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";

enum GradeSystems {
  "French" = "French",
  "YDS" = "YDS",
}

@Discord()
export abstract class Grade {
  @Slash("grade")
  async grade(
    @SlashOption("grade", {
      description: "The grade to convert",
      required: true,
    })
    grade: string,
    @SlashChoice(GradeSystems)
    @SlashOption("from", {
      description: "The grade system to convert from",
      required: false,
    })
    from: string,
    @SlashChoice(GradeSystems)
    @SlashOption("to", {
      description: "The grade system to convert to",
      required: false,
    })
    to: string,
    interaction: CommandInteraction
  ): Promise<void> {
    console.log(
      `Someone used the grade command: grade=${grade} from=${from} to=${to}`
    );
    await interaction.reply("Coming soon!");
    // TODO: Do system detection if not specified
    // TODO: Do actual conversions
  }
}
