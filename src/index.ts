import "reflect-metadata";
import { Client } from "discordx";
import dotenv from "dotenv";
import { IntentsBitField } from "discord.js";
import { importx } from "@discordx/importer";

dotenv.config();

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static async start(token: string): Promise<void> {
    this._client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
      ],
      botGuilds:
        process.env.NODE_ENV == "development"
          ? ["874599601078935612"]
          : undefined,
    });

    this._client.once("ready", async () => {
      await this._client.guilds.fetch();
      await this._client.initApplicationCommands();
      console.log("Bot started");
    });

    this._client.on("interactionCreate", (interaction) => {
      try {
        this._client.executeInteraction(interaction);
      } catch (e) {
        console.error("Failed to execute slash command: ", e);
      }
    });

    await importx(__dirname + "/commands/**/*.{js,ts}");
    await this._client.login(token);
  }
}

if (!process.env.DISCORD_TOKEN) throw new Error("No token specified!");
Main.start(process.env.DISCORD_TOKEN);
