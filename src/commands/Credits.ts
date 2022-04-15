import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export abstract class Credits {
  @Slash("credits")
  async credits(interaction: CommandInteraction): Promise<void> {
    await interaction.reply(
      "I am created by our lord and saviour: <@384348624492167168>!"
    ); // Links to Jetse#8905
    // TODO: Respond with dynamic credits (GitHub action possibly)
    console.log(
      `${interaction.user.username}#${interaction.user.discriminator} triggered the credits`
    );
  }
}
