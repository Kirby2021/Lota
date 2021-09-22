const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "application-list",
    description: "List all applications there are",
    category: "Utils",
    // owner: true,
     aliases: ["apps-list","app-list"],
    //sages: ["apps-list","app-list"],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        if(guild.applications) {
            if(guild.applications_list.length <= 0) {
                return message.reply({content: `${client.custom_emojis.cross} • This server has no applications setup!`})
            } else {
                let apps = []
                guild.applications_list.map((c) => {
                    apps.push(`> ${client.custom_emojis.tick} • \`${c.cmd}\` **(Questions: ${c.questions.length})**`)
                })
                const embed = new MessageEmbed()
                .setTitle(`${message.guild.name}'s Applications`)
                .setDescription(apps.join("\n"))
                .setColor(client.colors.pink)

                return message.reply({embeds: [embed]})
            }
        } else {
            return message.reply({content: `${client.custom_emojis.cross} • Please enable applications before running this command!`}) 
        }
    }
}