const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "nick",
    description: "Set a members nick.",
    category: "Moderation",
    // owner: true,
    // aliases: [],
    // usages: [],
    botPermissions: ["MANAGE_NICKNAMES"],
    userPermissions: ["MANAGE_NICKNAMES"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let newname;
        const arg = args.join(" ").split(" ? ")
        const member = message.mentions.members.first() || 
        message.guild.members.cache.find(m => m.id === arg[0] || m.user.username.toLowerCase() === arg[0].toLowerCase())

        if(!member) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid member!`})
        }
        if(!arg[1]) {
            newname = getName()
        } else {
            newname = arg[1].split("").slice(0, 32).join("")
        }
        if(message.guild.me.roles.highest.position < member.roles.highest.position) {
            return message.reply({content: `${client.custom_emojis.cross} • My role must be above this members role to change there nickname!`})
        }
        const embed = new MessageEmbed()
        .setDescription(` > ${client.custom_emojis.tick} • **Nickname Updated**\n\n > ${client.custom_emojis.warning} • **Old:** ${member.nickname ? member.nickname : "No previous nicknames"}\n > ${client.custom_emojis.warning} • **New:** ${newname}`)
        .setColor(client.colors.pink)

        member.setNickname(newname)
        .then(() => {
            message.reply({embeds: [embed]})
        }).catch((err) => {
            return message.reply({content: `${client.custom_emojis.cross} • There was an error setting this members nickname!`})
        })

        



    }
}

function getName() {
    const chars = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM[]:;'><.,/-_=+()*&^%$#@!{}qwertyuiopasdfghjklzxcvbnm|"
    let str = ""
    for(let i = 0; i < 32; i++) {
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
}