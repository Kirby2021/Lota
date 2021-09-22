const { Client, Message, MessageEmbed, MessageCollector } = require("discord.js")
const guilds = require("../../schemas/guild")

const stopreasons = {
    REQ: "1",
    ERR: "2",
    FINSHED: "3"
}

module.exports = {
    name: "application-remove",
    description: "Remove a server application",
    category: "Administrator",
    // owner: true,
    aliases: ["app-remove","app-delete","application-remove"],
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
        if(guild.applications === false){
            message.reply({content: `${client.custom_emojis.cross} • Please enable applications before using this command!`})
        } else {
            if(!args.length) {
                let apps = []
                guild.applications_list.map((app) => {
                    apps.push(` > ${client.custom_emojis.tick} • \`${app.cmd}\``)
                })
                const embed = new MessageEmbed()
                .setTitle(`Server Applications`)
                .setDescription(apps.join("\n"))
                .setColor(client.colors.pink)

                return message.reply({embeds: [embed]})
            }

            let value;
            let app;
            guild.applications_list.map((c) => {
                if(c.cmd.toLowerCase() === args.join(" ").toLowerCase()) {
                   value = true
                app = guild.applications_list.indexOf(c)
                }
            })
            if(value) {
                guild.applications_list.splice(app, 1)
                guild.save()
                return message.reply({content: `${client.custom_emojis.tick} • Deleted application \`${args.join(" ")}\`!`})
                
            } else {
                message.reply({content: `${client.custom_emojis.cross} • Please supply a valid application command!`})
            }
        }

    }
}