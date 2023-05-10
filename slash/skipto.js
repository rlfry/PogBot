const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder().setName("skipto").setDescription("Skips to a certain track #")
    .addNumberOption((option) => 
        option.setName("tracknumber").setDescription("The track to skip to").setMinValue(1).setRequired(true)),
	run: async ({ interaction }) => {
        const player = useMasterPlayer(); // Get the player instance that we created earlier
        const queue = player.nodes.get(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.size)
            return await interaction.editReply("Invalid track number")
		queue.node.skipTo(trackNum - 1)

        await interaction.editReply(`Skipped ahead to track number ${trackNum}`)
	},
}