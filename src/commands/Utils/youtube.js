const { Client, Message, MessageEmbed } = require("discord.js")
const ytsearch = require("yt-search")
module.exports = {
    name: "youtube",
    description: "Search for a video on youtube!",
    category: "Utils",
    // aliases: [],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if(!args.length) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a search query!`})
        }

        message.reply({content: `${client.custom_emojis.warning} • Searching for query`}).then(async (msg) => {
            let search = await ytsearch(args.join(" "))
            let video = search.videos[0]
            if(!video) {
                return msg.edit({content: `${client.custom_emojis.cross} • No videos found!`})
            }

            const { views, title, timestamp, thumbnail, url, duration, author, ago,  image} = video
            const embed = new MessageEmbed()
            .setThumbnail(thumbnail)
            .setImage(image)
            .addFields(
                {name: "Title", value: title},
                {name: "URL", value: `[Here](${url})`, inline: true},
                {name: "Author", value: `[${author.name}](${author.url})`, inline: true},
                {name: "Created", value: `${ago}`, inline: true},
                {name: "Length", value: `${timestamp}`, inline: true}, 
                {name: "Views", value: `${views}`, inline: true}
            )
            .setColor(client.colors.pink)
            .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

            msg.edit({content: `${client.custom_emojis.tick} • Query found!` ,embeds: [embed]})
        })

    }
}