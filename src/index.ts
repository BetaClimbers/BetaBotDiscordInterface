import "reflect-metadata";
import { Client } from "discordx";
import dotenv from "dotenv";
import { Intents } from "discord.js";

dotenv.config();

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(token: string): Promise<void> {
    this._client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      classes: [
        `${__dirname}/commands/*.ts`, // glob string to load the classes
        `${__dirname}/commands/*.js`, // If you compile your bot, the file extension will be .js
      ],
      slashGuilds:
        process.env.NODE_ENV == "development"
          ? ["874599601078935612"]
          : undefined,
      requiredByDefault: true,
    });

    this._client.once("ready", async () => {
      // await this._client.clearSlashes();
      // await this._client.clearSlashes("874599601078935612");
      await this._client.initSlashes();

      console.log("Bot started");
    });

    this._client.on("interactionCreate", (interaction) => {
      // console.log(interaction);
      this._client.executeInteraction(interaction);
    });

    await this._client.login(token);
  }
}

if (!process.env.DISCORD_TOKEN) throw new Error("No token specified!");
Main.start(process.env.DISCORD_TOKEN);
