import { Client } from "@typeit/discord";
import dotenv from "dotenv";

dotenv.config();

export class Main {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  static start(token: string): void {
    this._client = new Client();

    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    this._client.login(
      token,
      `${__dirname}/discords/*.ts`, // glob string to load the classes
      `${__dirname}/discords/*.js` // If you compile your bot, the file extension will be .js
    );

    console.log(Client.getCommands());
  }
}

if (!process.env.DISCORD_TOKEN) throw new Error("No token specified!");
Main.start(process.env.DISCORD_TOKEN);
