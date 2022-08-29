const { SlashCommandBuilder } = require("@discordjs/builders")
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Set loop mode")
        .addSubcommand((subcommand)=>
            subcommand
                .setName("off")
                .setDescription("Stops the loop")
        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName("track")
                .setDescription("Loops the current track")
        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName("queue")
                .setDescription("Loops the current queue")
        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName("autoplay")
                .setDescription("Starts autoplaying music")
        ),
    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing) {
            return await interaction.editReply("No music is being played!")
        }
        if (interaction.options.getSubcommand() === "off") {
            queue.setRepeatMode(QueueRepeatMode.OFF)
        } else if (interaction.options.getSubcommand() === "track") {
            queue.setRepeatMode(QueueRepeatMode.TRACK)
        } else if (interaction.options.getSubcommand() === "queue") {
            queue.setRepeatMode(QueueRepeatMode.QUEUE)
        } else if (interaction.options.getSubcommand() === "autoplay") {
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
        }

        await interaction.editReply(`Updated loop mode to **${interaction.options.getSubcommand()}**`)
    },
}