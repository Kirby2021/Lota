const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "ar-add",
    description: "Add a auto responder!",
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
        if(guild.auto_responders.length >= 10) {
            return message.reply({content: `${client.custom_emojis.cross} • Only premium servers can have more than 10 auto responders`})
        }
        }

        if(arg[0].split("").length >= 100) {
            return message.reply({content: `${client.custom_emojis.cross} • Auto responder triggers must be less than 100 charaters`})
        }
        let alreadyValid = false
        guild.auto_responders.map(async (c) => {
            if(c.trigger === arg[0]) {
                 alreadyValid = true
            } else {
                alreadyValid = false
            }
        })
        if(alreadyValid) {
            message.reply({content: `${client.custom_emojis.cross} • This is already a valid auto responder!`})
        } else {
        await guilds.findOneAndUpdate({guildId: message.guild.id}, {
            $push: {
                auto_responders: [
                    {
                        trigger: arg[0],
                        res: arg.slice(1).join(" ")
                    }
                ]
            }
        })
        const embed = new MessageEmbed()
        .setAuthor(`Auto responder added!`, client.user.displayAvatarURL())
        .setDescription(`**Auto responder added:**\nTrigger: ${arg[0]}\nResponse: ${arg.slice(1).join(" ")}`)
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        message.reply({embeds: [embed]})
    }
    }
}