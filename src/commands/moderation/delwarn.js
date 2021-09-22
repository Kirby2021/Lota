const { Client, Message, MessageEmbed } = require("discord.js")
const users = require(`../../schemas/users`)

module.exports = {
    name: "delwarn",
    description: "",
    category: "",
    aliases: ["deletewarning","removewarning"],
    // usages: [],
    // botPermissions: [],
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
        let warn_id = arg[1]
        if(!member) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid member!`})
        }
        if(!warn_id) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a warn id!`})
        }
        const user = await users.findOne({userId: member.id, guildId: message.guild.id})
        if(user) {

            if(user.warns.length <= 0) {
                message.reply({content: `${client.custom_emojis.warning} • This member has no warns!`})
            }
            let valid_warn = false
            let warn_index 
            user.warns.forEach((w) => {
                if(w.id === arg[1]) {
                    valid_warn = true
                    warn_index = user.warns.indexOf(w)
                }
            })

            if(valid_warn) {
                user.warns.splice(warn_index, 1)
                user.save()

                const embed = new MessageEmbed()
                .setAuthor(`Request Successful`, client.user.displayAvatarURL())
                .setDescription(`Successfully remove warn (\`${arg[1]}\`) from ${member}`)
                .setColor(client.colors.pink)

                return message.reply({embeds: [embed]})
            } else {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid warn id!`})
            }


        } else {
            message.reply({content: `${client.custom_emojis.warning} • This member has no data!`})
        }
    }
}