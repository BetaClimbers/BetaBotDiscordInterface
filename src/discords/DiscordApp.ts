import {
  CommandNotFound,
  Discord,
  CommandMessage,
  On,
  ArgsOf,
} from "@typeit/discord";
import * as Path from "path";

@Discord("!", {
  import: [
    Path.join(__dirname, "..", "commands", "*.ts"),
    Path.join(__dirname, "..", "commands", "*.js"),
  ],
})
export class DiscordApp {
  @On("message")
  onMessage([message]: ArgsOf<"message">): void {
    console.log(message);
  }

  @CommandNotFound()
  notFoundA(command: CommandMessage): void {
    command.reply("Command not found");
  }
}
