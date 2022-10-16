const { SlashCommandBuilder } = require("@discordjs/builders")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder().setName("stop").setDescription("Stops the bot and clears the queue"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

        //TODO fix this so it plays the dumb fart noise after it clears the queue

		queue.stop()
        queue.clear()
        await interaction.editReply("Bye!")

        const result = await client.player.search("https://www.youtube.com/watch?v=Qi1KebO4bzc", {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_VIDEO
        })
        if (result.tracks.length === 0)
            return interaction.editReply("No results")
        
        const song = result.tracks[0]
        await queue.addTrack(song)
        await queue.play()
        await queue.destroy()
	},
}