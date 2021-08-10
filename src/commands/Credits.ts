import { CommandMessage, Command } from "@typeit/discord";

export abstract class Credits {
  @Command("credits")
  credits(command: CommandMessage): void {
    command.reply(
      "I am created by our lord and saviour: <@384348624492167168>!"
    ); // Should link to Jetse#8905
    // TODO: Respond with dynamic credits (GitHub action possibly)
  }
}
