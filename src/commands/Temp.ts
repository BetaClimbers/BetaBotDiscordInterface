import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";

enum TempUnit {
  Kelvin,
  Celsius,
  Fahrenheit,
}

@Discord()
export abstract class Temp {
  @Slash({
    name: "temp",
    description: "Convert temperatures between normal and freedom units",
  })
  async temp(
    @SlashOption({
      name: "temperature",
      description: "The temperature to convert",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    temperature: string,
    @SlashChoice(...Object.keys(TempUnit).filter((key) => isNaN(parseInt(key))))
    @SlashOption({
      name: "from",
      description: "The unit to convert from",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    from: TempUnit | undefined,
    interaction: CommandInteraction
  ): Promise<void> {
    temperature = temperature.toLowerCase().trim();

    console.log(
      `${interaction.user.username}#${interaction.user.discriminator} used the temp command: temperature=${temperature} from=${from}`
    );

    if (!from) {
      if (temperature.endsWith("k")) {
        from = TempUnit.Kelvin;
      } else if (temperature.endsWith("c")) {
        from = TempUnit.Celsius;
      } else if (temperature.endsWith("f")) {
        from = TempUnit.Fahrenheit;
      } else {
        await interaction.reply(
          "Couldn't automatically detect the source unit, please specify it manually."
        );
        return;
      }
    }

    const value = parseInt(temperature);

    if (isNaN(value)) {
      await interaction.reply("Invalid number, please try again.");
      return;
    }

    if (from === TempUnit.Kelvin) {
      const celsius = value - 273.15;
      const fahrenheit = (celsius * 9) / 5 + 32;
      await interaction.reply(
        `${value.toFixed(1)} K is:\n${celsius.toFixed(
          1
        )} °C\n${fahrenheit.toFixed(1)} degrees in freedom units`
      );
    } else if (from === TempUnit.Celsius) {
      const kelvin = value + 273.15;
      const fahrenheit = (value * 9) / 5 + 32;
      await interaction.reply(
        `${value.toFixed(1)} °C is:\n${kelvin.toFixed(
          1
        )} K\n${fahrenheit.toFixed(1)} degrees in freedom units`
      );
    } else if (from === TempUnit.Fahrenheit) {
      const celsius = ((value - 32) * 5) / 9;
      const kelvin = celsius + 273.15;
      await interaction.reply(
        `${value.toFixed(1)} °F is:\n${kelvin.toFixed(1)} K\n${celsius.toFixed(
          1
        )} °C`
      );
    }
  }
}
