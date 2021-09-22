const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "ban",
    description: "Ban a member!",
    category: "Moderation",
    // aliases: [],
    usages: ["<member> ? <reason>"],
    botPermissions: ["BAN_MEMBERS"],
    userPermissions: ["BAN_MEMBERS"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const arg = args.join(" ").split(" ? ")
        let member = message.mentions.members.first() ||
        message.guild.members.cache.find(m => m.id === arg[0] || m.user.username.toLowerCase() === arg[0].toLowerCase() || m.user.tag.toLowerCase() === arg[0].toLowerCase()) 
        if(!member) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid member!`})
        }
        let reason = arg[1] || "No reason"
        if(member.permissions.has("BAN_MEMBERS")) {
            return message.reply({content: `${client.custom_emojis.cross} • I can not ban other people with the ban members permission!!`})
        }
        if(member.roles.highest.position >= message.guild.me.roles.highest.position) {
            return message.reply({content: `${client.custom_emojis.cross} • I can not ban members with the same or a higher role than me!`})
        }
        member.ban({reason: reason, days: 7})

        const embed = new MessageEmbed()
        .setAuthor(`Banned Member!`, client.user.displayAvatarURL())
        .setDescription(`${client.custom_emojis.tick} • Succesfully banned <@${member.id}> (\`${member.id}\`) from ${message.guild.name}`)
        .setColor(client.colors.pink)

        message.channel.send({embeds: [embed]})
        setTimeout(() => {
            message.delete().catch(() => {})
        }, 100);
    }
}