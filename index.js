const {Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require("path");

// Config file to store id's and tokens.
const config = require('./config.json');

// Open a new client with given *required* intents.
const client = new Client(
    {
        intents: 
        [
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.MessageContent, 
            GatewayIntentBits.GuildMessages
        ]
    });


// Obtain all the command files inside the commands directory.
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, e => {
    client.user.setActivity('Hello World!');
    console.log(`Rosa Manager has been started from ${e.user.name}!`);
    
    for (const command of client.commands.values()) {
      client.application.commands.create(command.data);
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
    
    } else if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
        }
    }
});

client.login(config.Token);

