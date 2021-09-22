const { Client, Message, MessageEmbed } = require("discord.js")
const users = require(`../../schemas/users`)
module.exports = {
    name: "warn",
    description: "Warn a member",
    category: "Moderation",
    // aliases: [],
    usages: ["<member> ? <reason>"],
    //botPermissions: ["MANAGE_MESSAGES"],
    userPermissions: ["MANAGE_MESSAGES"],
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

        const user = await users.findOne({userId: member.id, guildId: message.guild.id})
        if(!user) { await users.create({userId: member.id, guildId: message.guild.id})}
        setTimeout(async () => {
            
        await users.findOneAndUpdate({userId: member.id, guildId: message.guild.id}, {
            $push: {
                warns: [
                    {
                        reason: reason,
                        moderator: message.author.id,
                        time: Date.now(),
                        id: id(),
                        channel: message.channel.id,
                    }
                ]
            }
        })

        const embed = new MessageEmbed()
        .setColor(client.colors.pink)
        .setDescription(`> ${client.custom_emojis.tick} • ${member} has successfully been warned!`)
        
        setTimeout(() => {
            message.delete().catch(() => {})
        }, 100);
        return message.channel.send({embeds: [embed]})

        }, 1000);
    }
}

function id() {
    let chars = "12345678910QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm"
    let str = ""
    for(let i = 0; i < 15; i++) {
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
}