import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import ClimbingGrade, { gradeSystemsList } from "../climbing-grade";

const GradeSystems: {
  [key: string]: gradeSystemsList;
} = {
  French: "french",
  "Yosemite Decimal System": "yds",
  American: "yds",
  Australian: "australian",
  "South African": "south_african",
  UIAA: "uiaa",
  Hueco: "hueco",
  British: "british",
  Kurtyka: "kurtyki",
};

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
      required: true, // TODO: Change to false when detection works
    })
    from: gradeSystemsList | undefined,
    @SlashChoice(GradeSystems)
    @SlashOption("to", {
      description: "The grade system to convert to",
      required: true, // TODO: Change to false when unspecified targets work
    })
    to: gradeSystemsList | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    console.log(
      `Someone used the grade command: grade=${grade} from=${from} to=${to}`
    );

    if (!from) {
      await interaction.reply("Grade system detection coming soon!");
      // TODO: Add grade system detection
      return;
    }

    if (!to) {
      await interaction.reply("Unspecified grade target coming soon!");
      // TODO: Add multiple grade targets
      return;
    }

    // TODO: Add grade validation (same regex's for detection can be used)
    // TODO: Clean up grade when explicitly specified (example: add "5." to start of YDS)

    try {
      const climbingGrade = new ClimbingGrade(grade, from);
      await interaction.reply(
        `${grade} in ${from} is ${climbingGrade.format(to)} in ${to}`
      );
    } catch (e) {
      await interaction.reply(
        `Something went wrong while converting: ${(e as Error).message}`
      );
    }
  }
}
