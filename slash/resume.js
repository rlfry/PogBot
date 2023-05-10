const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder().setName("resume").setDescription("Resumes the music"),
    run: async ({ interaction }) => {
        const player = useMasterPlayer(); // Get the player instance that we created earlier
        const queue = player.nodes.get(interaction.guildId)

        if (!queue) return await interaction.editReply("There are no songs in the queue")

        queue.node.resume();
        await interaction.editReply("Music has been resumed! Use `/pause` to pause the music")
    },
}