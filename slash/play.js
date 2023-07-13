const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { useMasterPlayer, QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("loads songs from youtube")
        .addSubcommand((subcommand)=>
            subcommand
                .setName("song")
                .setDescription("Loads a single song from a url")
                .addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName("playlist")
                .setDescription("Loads a playlist of songs from a url")
                .addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
        )
        .addSubcommand((subcommand)=>
            subcommand
                .setName("search")
                .setDescription("Searches for a song based on provided keyword(s)")
                .addStringOption((option) => option.setName("searchterms").setDescription("the search keywords").setRequired(true))
                .addStringOption((option) => option.setName("searchengine")
                                            .setDescription("Optional: Where to search from. By default, this will use all of the search engines.")
                                            .setRequired(false)
                                            .addChoices(
                                                { name: 'Youtube', value: "Youtube" },
                                                { name: 'Spotify', value: "Spotify" },
                                                { name: 'Soundcloud', value: "Soundcloud"},
                                            ))
        ),
    run: async ({ interaction }) => {
        try {
            // Get the player instance that we created earlier
            const player = useMasterPlayer();

            let embed = new EmbedBuilder()

            if (interaction.options.getSubcommand() === "song") {
                let url = interaction.options.getString("url")
                const result = await player.search(url, {
                    requestedBy: interaction.user
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("No results")
                
                const res = await player.play(
                    interaction.member.voice.channel.id,
                    result,
                    {
                        nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild.members.me,
                            requestedBy: interaction.user,
                        },
                        bufferingTimeout: 15000,
                        leaveOnStop: true,
                        leaveOnStopCooldown: 5000,
                        leaveOnEnd: true,
                        leaveOnEndCooldown: 15000,
                        leaveOnEmpty: true,
                        leaveOnEmptyCooldown: 300000,
                        skipOnNoStream: true,
                        },
                    }
                );

                const song = res.track
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
            } else if (interaction.options.getSubcommand() === "playlist") {
                let url = interaction.options.getString("url")
                const result = await player.search(url, {
                    requestedBy: interaction.user
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("No results")
                
                const res = await player.play(
                    interaction.member.voice.channel.id,
                    result,
                    {
                        nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild.members.me,
                            requestedBy: interaction.user,
                        },
                        bufferingTimeout: 15000,
                        leaveOnStop: true,
                        leaveOnStopCooldown: 5000,
                        leaveOnEnd: true,
                        leaveOnEndCooldown: 15000,
                        leaveOnEmpty: true,
                        leaveOnEmptyCooldown: 300000,
                        skipOnNoStream: true,
                        },
                    }
                );

                const playlist = res.track.playlist
                embed
                    .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                    .setThumbnail(res.track.thumbnail)
            } else if (interaction.options.getSubcommand() === "search") {
                let url = interaction.options.getString("searchterms")
                let searchEngineText = interaction.options.getString("searchengine")
                let searchEngine
                switch(searchEngineText) {
                    case "Youtube":
                        searchEngine = QueryType.YOUTUBE_SEARCH
                        break;
                    case "Soundcloud":
                        searchEngine = QueryType.SOUNDCLOUD_SEARCH
                        break;
                    case "Spotify":
                        searchEngine = QueryType.SPOTIFY_SEARCH
                        break;
                    default:
                        searchEngine = QueryType.YOUTUBE_SEARCH
                        break;
                }

                const result = await player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: searchEngine
                });
                if (result.tracks.length === 0)
                    return interaction.editReply("No results")

                const res = await player.play(
                    interaction.member.voice.channel.id,
                    result,
                    {
                        nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild.members.me,
                            requestedBy: interaction.user,
                        },
                        bufferingTimeout: 15000,
                        leaveOnStop: true,
                        leaveOnStopCooldown: 5000,
                        leaveOnEnd: true,
                        leaveOnEndCooldown: 15000,
                        leaveOnEmpty: true,
                        leaveOnEmptyCooldown: 300000,
                        skipOnNoStream: true,
                        },
                    }
                );
                
                const song = res.track
                embed
                    .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duration: ${song.duration}`})
            }
            await interaction.editReply({
                embeds: [embed]
            })
        } catch(e) {
            console.log(e)
        }
    },
}