const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")
module.exports = {
    name: "cc-add",
    description: "Add a custom command",
    category: "Administrator",
    // aliases: [],
    usages: ["<trigger> | <response>"],
    // botPermissions: [],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        const arg = args.join(" ").split(" | ")
        if(!arg[0] || !arg[1]) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid trigger and response (*split them by using a \`|\`*)`})
        }
        if(!guild.premium) {
        if(guild.custom_commands.length >= 10) {
            return message.reply({content: `${client.custom_emojis.cross} • Only premium servers can have more than 10 custom commands`})
        }
        }

        if(arg[0].split("").length >= 25) {
            return message.reply({content: `${client.custom_emojis.cross} • Custom command triggers must be less than 25 charaters`})
        }
        let alreadyValid = false
        guild.custom_commands.map(async (c) => {
            if(c.trigger === arg[0]) {
                 alreadyValid = true
            } else {
                alreadyValid = false
            }
        })
        if(alreadyValid) {
            message.reply({content: `${client.custom_emojis.cross} • This is already a valid custom command!`})
        } else {
        await guilds.findOneAndUpdate({guildId: message.guild.id}, {
            $push: {
                custom_commands: [
                    {
                        trigger: arg[0].split(" ").join("-"),
                        res: arg.slice(1).join(" ")
                    }
                ]
            }
        })
        const embed = new MessageEmbed()
        .setAuthor(`Custom command added!`, client.user.displayAvatarURL())
        .setDescription(`**Custom command added:**\nTrigger: ${arg[0].split(" ").join("-")}\nResponse: ${arg.slice(1).join(" ")}`)
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        message.reply({embeds: [embed]})
    }
    }
}