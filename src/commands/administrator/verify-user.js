const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "verify-user",
    description: "Force verify a user / bot!",
    category: "Administrator",
    // owner: true,
    // aliases: [],
    // usages: [],
    botPermissions: ["MANAGE_ROLES"],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        if(guild.verification) {
            const member = message.mentions.members.first() ||
            message.guild.members.cache.find(m => m.id === args.join(" ") || m.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.member;

            member.roles.add(guilds.verification_role)
            const embed = new MessageEmbed()
                .setDescription(` > ${client.custom_emojis.tick} • ${member} has been verified!`)
                .setColor(client.colors.pink)
                message.channel.send({embeds: [embed]})
                
        } else {
            return message.reply({content: `${client.custom_emojis.cross} • Please setup verification before using this command!`})
        }
    }
}