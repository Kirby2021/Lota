const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "prefix",
    description: "Set, reset the servers prefix!",
    category: "Administrator",
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
        let values = ["set","reset"]
        const guildData = await guilds.findOne({guildId: message.guild.id})
        if(!args.length || !values.includes(args[0].toLowerCase())) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid type! \`${values.join("`, `")}\`\n${client.custom_emojis.warning} • Current prefix: **${guildData.prefix}**`})
        }
        if(args[0].toLowerCase() === "set") {
            const prefix = args[1]
            
            if(!prefix) {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid prefix!`})
            }
            if(prefix.length >= 6) {
                return message.reply({content: `${client.custom_emojis.cross} • Prefixes must be less than 5 charaters`})
            }

            if(prefix) {
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    prefix: args[1]
                })
                
                return message.reply({content: `${client.custom_emojis.tick} • Prefix has been updated to **${args[1]}**`})
            }
        } else if(args[0].toLowerCase() === "reset") {
            await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                prefix: "^^"
            })
            
            return message.reply({content: `${client.custom_emojis.tick} • Prefix has been reset to **^^**`})
        }
    }
}