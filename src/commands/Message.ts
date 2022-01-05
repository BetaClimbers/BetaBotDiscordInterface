import {ArgsOf, Client, Discord, On} from "discordx";

@Discord()
export abstract class Message {
  @On("messageCreate")
  onMessage([message]: ArgsOf<"messageCreate">, client: Client): void {
    if(message.author.bot) return;
    console.log(message.author, message.content);

    // If last score increase of user was >60 seconds ago, increase score of user with id message.author.id
    // If author leveled up due to this message, send an announcement in #bot-channel
  }
}