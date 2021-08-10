import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export abstract class Credits {
  @Slash("credits")
  credits(interaction: CommandInteraction): void {
    interaction.reply(
      "I am created by our lord and saviour: <@384348624492167168>!"
    ); // Should link to Jetse#8905
    // TODO: Respond with dynamic credits (GitHub action possibly)
  }
}
