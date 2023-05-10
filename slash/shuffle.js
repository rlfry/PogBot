const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
    run: async ({ interaction }) => {
        const player = useMasterPlayer(); // Get the player instance that we created earlier
        const queue = player.nodes.get(interaction.guildId)

        if (!queue) return await interaction.editReply("There are no songs in the queue")

        queue.tracks.shuffle();
        await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled!`)
    },
}