const dotenv = require("dotenv")
const { Client, Collection } = require('discord.js');
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

// Discord Application ID
const CLIENT_ID = process.env.CLIENT_ID
// Discord Server ID
const GUILD_ID = process.env.GUILD_ID

const client = new Client({
    intents: ['Guilds', 'GuildVoiceStates']
});

client.slashcommands = new Collection()

const { Player } = require("discord-player");

// this is the entrypoint for discord-player based application
const player = new Player(client);

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9"}).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands}).then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        if (err) {
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    });
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            // This is to load the default extractors from the @discord-player/extractor package
            await player.extractors.loadDefault();

            const slashcmd = client.slashcommands.get(interaction.commandName)

            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    });
    // this event is emitted whenever discord-player starts to play a track
    player.events.on('playerStart', (queue, track) => {
        // we will later define queue.metadata object while creating the queue
        queue.metadata.channel.send(`Started playing **${track.title}**`);
    });
    client.login(TOKEN)
}