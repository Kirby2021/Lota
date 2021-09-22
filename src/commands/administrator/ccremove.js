const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "cc-remove",
    description: "Remove a custom command!",
    category: "Administrator",
    // aliases: [],
    // usages: [],
    // botPermissions: [],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        if(guild.custom_commands.length <=0) {
            return message.reply({content: `${client.custom_emojis.cross} • This server doesnt have any custom commands!`})
        }

        let iscommand = false
        let commandIndex 
        guild.custom_commands.map((c) => {
            if(c.trigger.toLowerCase() === args.join("-").toLowerCase()) {
                iscommand = true
                
                commandIndex = guild.custom_commands.indexOf(c)
            } else {
                iscommand = false
            }
        })

        
        if(iscommand) {
            guild.custom_commands.splice(commandIndex, 1)
            guild.save()

            const embed = new MessageEmbed()
            .setAuthor(`Custom command removed!`, client.user.displayAvatarURL())
            .setDescription(`Removed custom command \`${args.join("-")}\`!`)
            .setColor(client.colors.pink)
            .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())
    
            return message.reply({embeds: [embed]})

        } else {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid custom command!`})
        }

        
    }
}