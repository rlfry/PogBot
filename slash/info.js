const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { usePlayer } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder().setName("info").setDescription("Displays info about the currently playing song"),
    run: async ({ interaction }) => {
        const guildQueue = usePlayer(interaction.guildId)

        if (!guildQueue) return await interaction.editReply("There are no songs in the queue")

        let bar = guildQueue.createProgressBar({
            queue: false,
            length: 19,
        })

        const song = guildQueue.queue.currentTrack

        await interaction.editReply({
            embeds: [new EmbedBuilder()
            .setThumbnail(song.thumbnail)
            .setDescription(`Currently Playing [${song.title}](${song.url})\n\n` + bar)
        ],
        })
    },
}