import { ArgsOf, Discord, On } from "discordx";

const triggers: Array<{
  match: string | RegExp;
  reply: string;
  timeout?: number;
  ignoreFrom?: string[];
}> = [
  {
    match: /dumm(y|ie)/,
    // BetaClimber
    reply: "`dummy` detected, you probably mean <@445032542052155392>",
    timeout: 10 * 60 * 1000, // 10 minutes
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
    match: /(?<!\w)anchors?(?!\w)/,
    // Match free standing anchor(s), so no anchorage, but do match at beginning or end of message
    // a gear head
    reply: "`anchors` you say? <@100288611609485312> probably knows the answer",
    timeout: 10 * 60 * 1000, // 10 minutes
    ignoreFrom: ["100288611609485312"],
  },
  {
    match: /(((i|(\w'))s)|are) aid(?!\w)/,
    // 's aid, is aid, are aid
    // Wait, it's all aid? Always has been
    reply: "https://i.imgflip.com/6d34yy.jpg",
  },
];

const lastMessage: { [key: number]: { [key: string]: number } } = {};

@Discord()
export abstract class Pinger {
  @On("messageCreate")
  async onMessage([message]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.author.bot) return;

    const lowerCaseContent = message.content.toLowerCase();

    for (const [i, trigger] of triggers.entries()) {
      if (lowerCaseContent.match(trigger.match)) {
        // TODO: Maybe log the actual match, not the regex
        console.log(
          `${message.author.username}#${message.author.discriminator} triggered the ${trigger.match} keyword`
        );

        if ((trigger.ignoreFrom ?? []).includes(message.author.id)) {
          console.log("Aborting, author is on ignore list");
          break;
        }

        const guildId = message.guildId;
        if (guildId === null) {
          console.log("Aborting, guildId is null");
          break;
        }

        const time = new Date().getMilliseconds();

        // If this trigger didn't yet create a timeout entry, set it
        // If this guild (server) didn't yet create a timeout, set it
        // If the last reply was more than `timeout` milliseconds ago, set it to the current time
        if (lastMessage[i] === undefined) lastMessage[i] = { [guildId]: time };
        else if (
          lastMessage[i][guildId] === undefined ||
          time - lastMessage[i][guildId] > (trigger.timeout ?? 0)
        ) {
          lastMessage[i][guildId] = time;
        } else {
          console.log("Didn't send reply because of timeout");
          break;
        }

        await message.reply(trigger.reply);
        break;
      }
    }

    // If last score increase of user was >60 seconds ago, increase score of user with id message.author.id
    // If author leveled up due to this message, send an announcement in #bot-channel
  }
}
