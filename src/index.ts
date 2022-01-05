import "reflect-metadata";
import { Client } from "discordx";
import dotenv from "dotenv";
import { Intents } from "discord.js";
import { importx } from "@discordx/importer";

dotenv.config();

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(token: string): Promise<void> {
    this._client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
      botGuilds:
        process.env.NODE_ENV == "development"
          ? ["874599601078935612"]
          : undefined,
    });

    this._client.once("ready", async () => {
      console.log("Bot started");
    });

    this._client.on("interactionCreate", (interaction) => {
      this._client.executeInteraction(interaction);
    });

    await importx(__dirname + "/commands/**/*.{js,ts}");
    await this._client.login(token);
  }
}

if (!process.env.DISCORD_TOKEN) throw new Error("No token specified!");
Main.start(process.env.DISCORD_TOKEN);
