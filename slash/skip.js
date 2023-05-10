const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { useMasterPlayer } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
	run: async ({ interaction }) => {
        const player = useMasterPlayer(); // Get the player instance that we created earlier
        const queue = player.nodes.get(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

        const currentSong = queue.currentTrack

		queue.node.skip();
        await interaction.editReply({
            embeds: [
                new EmbedBuilder().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}