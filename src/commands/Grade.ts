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

const Regexes: {
  system: gradeSystemsList;
  regex: RegExp;
}[] = [
  {
    system: "french",   // Base french system
    regex: /^[1-9][abc][+]?$/,
  },
  {
    system: "french", // French where we do not expect letters or plus
    regex: /^[1-9]([abc][+])?$/,
  },
  {
    system: "yds",  // Base YDS from 5.0 to 5.9
    regex: /^5\.[0-9]$/,
  },
  {
    system: "yds",  // YDS from 5.10-5.15 where we expect letters
    regex: /^5\.1[0-5][a-d]$/,
  },
  {
    system: "yds",  //YDS from 5.10-5.15 where we do not expect letters
    regex: /^5\.1[0-5]$/,
  }
];

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
    from: gradeSystemsList | undefined,
    @SlashChoice(GradeSystems)
    @SlashOption("to", {
      description: "The grade system to convert to",
      required: false,
    })
    to: gradeSystemsList | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    console.log(
      `Someone used the grade command: grade=${grade} from=${from} to=${to}`
    );

    if (!from) {
      const detectedSystem = Grade.detectGradeSystem(grade);
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
      if (!Grade.verifyGrade(grade, from)) {
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

  // Maybe regex system should be moved to climbing-grade.ts

  private static detectGradeSystem(grade: string): gradeSystemsList | null {
    for (const { system, regex } of Regexes)
      if (regex.test(grade)) return system;
    return null;
  }

  private static verifyGrade(grade: string, system: gradeSystemsList): boolean {
    const regexes = Regexes.filter(
      ({ system: regexSystem }) => regexSystem === system
    );
    if (regexes.length === 0) return true;
    for (const { regex } of regexes) if (regex.test(grade)) return true;
    return false;
  }
}
