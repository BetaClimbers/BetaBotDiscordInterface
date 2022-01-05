import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import ClimbingGrade, {
  gradeSystems,
  gradeSystemsList,
} from "../climbing-grade";

const GradeSystems: {
  [key: string]: gradeSystemsList;
} = {
  French: "french",
  "Yosemite Decimal System": "yds",
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
      // required: true,
    })
    grade: string,
    @SlashChoice(GradeSystems)
    @SlashOption("from", {
      description: "The grade system to convert from",
      required: false,
    })
    from: gradeSystemsList,
    // from: gradeSystemsList | undefined,
    @SlashChoice(GradeSystems)
    @SlashOption("to", {
      description: "The grade system to convert to",
      required: false,
    })
    to: gradeSystemsList,
    // to: gradeSystemsList | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    grade = grade.trim();

    console.log(
      `${interaction.user.username}#${interaction.user.discriminator} used the grade command: grade=${grade} from=${from} to=${to}`
    );

    if (!from) {
      const detectedSystem = ClimbingGrade.detectGradeSystem(grade);
      if (detectedSystem) from = detectedSystem;
      else {
        await interaction.reply(
          "Couldn't automatically detect the source grade, please specify it manually."
        );
        return;
      }
    } else {
      // TODO: Clean up grade when explicitly specified (example: add "5." to start of YDS)

      // This check is only necessary for manual source grades systems
      if (!ClimbingGrade.verifyGrade(grade, from)) {
        await interaction.reply(
          `Specified grade (${grade}) didn't match specified system (${from})`
        );
        return;
      }
    }

    // TODO: Transform raw system ID to user-friendly string
    try {
      const climbingGrade = new ClimbingGrade(grade, from);
      if (to) {
        await interaction.reply(
          `${grade} in ${from} is ${climbingGrade.format(to)} in ${to}`
        );
      } else {
        await interaction.reply(
          [
            `${grade} in ${from} is:`,
            ...(Object.keys(gradeSystems) as gradeSystemsList[])
              .filter((system) => system != from)
              .map((system) => `${climbingGrade.format(system)} in ${system}`),
          ].join("\n")
        );
      }
    } catch (e) {
      await interaction.reply(
        `Something went wrong while converting: ${(e as Error).message}`
      );
    }
  }
}
