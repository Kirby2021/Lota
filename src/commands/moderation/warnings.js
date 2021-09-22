const { Client, Message, MessageEmbed } = require("discord.js")
const users = require(`../../schemas/users`)

module.exports = {
    name: "warnings",
    description: "See all of a members warnings",
    category: "Moderation",
    aliases: ["warns", "infractions"],
    // usages: [],
    // botPermissions: [],
    userPermissions: ["MANAGE_MESSAGES"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let member = message.mentions.members.first() || message.guild.members.cache.find(m => m.id === args.join(" ") || m.user.username.toLowerCase() === args.join(" ").toLowerCase() || m.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.member
        const user = await users.findOne({userId: member.id, guildId: message.guild.id})
        if(user) {
            let warnings = []
            user.warns.forEach((w) => {
                warnings.push(
                    {
                        name: `ID: ${w.id} • Moderator: ${message.guild.members.cache.find(m =>m.id === w.moderator).user.tag}`,
                        value: ` > ${client.custom_emojis.warning} • **Reason:** ${w.reason}\n > ${client.custom_emojis.warning} • **Date:** <t:${Math.floor(w.time / 1000)}:D>\n> ${client.custom_emojis.warning} • **Channel:** ${message.guild.channels.cache.find(c => c.id === w.channel).name || "Channel not found"}`
                    }
                )
            })
            if(user.warns.length <= 0) {
                message.reply({content: `${client.custom_emojis.warning} • This member has no warns!`})
            } else {
                const embed = new MessageEmbed()
                .addFields(warnings)
                .setColor(client.colors.pink)
                .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

                return message.reply({embeds: [embed]})
            }

        } else {
            message.reply({content: `${client.custom_emojis.warning} • This member has no warns!`})
        }
    }
}