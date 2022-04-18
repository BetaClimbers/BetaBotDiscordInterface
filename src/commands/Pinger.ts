import { ArgsOf, Discord, On } from "discordx";

const triggers: Array<{ match: string | RegExp; reply: string }> = [
  {
    match: "dummy",
    // BetaClimber
    reply: "`dummy` detected, you probably mean <@445032542052155392>",
  },
  {
    match: "smart person",
    // Jetse
    reply: "`smart person` detected, you probably mean <@384348624492167168>",
  },
  {
    match: "terminal velocity",
    // Matlab
    reply:
      "`terminal velocity` detected, you probably want to talk to <@178030175500500992>",
  },
  {
    match: "stacked cams",
    // WideCamSam
    reply:
      "`stacked cams` detected, you probably want to talk to <@689306616784617498>",
  },
  {
    match: "anchors",
    // a gear head
    reply: "`anchors` you say? <@100288611609485312> probably knows the answer",
  },
];

@Discord()
export abstract class Pinger {
  @On("messageCreate")
  async onMessage([message]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.author.bot) return;
    // console.log(message.author, message.content);

    for (const trigger of triggers) {
      if (message.content.match(trigger.match)) {
        // TODO: Maybe log the actual match, not the regex
        console.log(
          `${message.author.username}#${message.author.discriminator} triggered the ${trigger.match} keyword`
        );
        await message.reply(trigger.reply);
        break;
      }
    }

    // If last score increase of user was >60 seconds ago, increase score of user with id message.author.id
    // If author leveled up due to this message, send an announcement in #bot-channel
  }
}
