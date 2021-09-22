const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "leveling-addautorole",
    description: "Add an auto role to leveling",
    category: "administrator",
    // owner: true,
    // aliases: [],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args, {prefix}) => {
        const [level, ...roles] = args
        let role = message.mentions.roles.first() ||
        message.guild.roles.cache.find(r => r.id === roles.join(" ") || r.name === roles.join(" ").toLowerCase())

        if(!level || !roles.length) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply the valid arguments! (\`${prefix}level-addautorole <level> <role id/name/mention>\`)`})
        }
        if(!level) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a level!`})
        }
        if(!role){
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a role!`})
        }
        await guilds.findOneAndUpdate({guildId: message.guild.id}, {
            $push: {
                leveling_roles: [
                    {
                        level: level,
                        id: role.id
                    }
                ]
            }
        })

        return message.reply({content: `${client.custom_emojis.tick} • Added! now at level \`${level}\` you will gain the **${role.name}** role!`})

    }
}