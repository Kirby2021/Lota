const { Client, Message, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js")
const fs = require('fs')
module.exports = {
    name: "help",
    description: "See the help panel!",
    category: "Information",
    aliases: ["h","cmd","cmds","command","commands"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if(!args.length) {
        let categorys = []
        let dropdowns = []
        dropdowns.push({
            label: `General`,
            emoji: `${client.custom_emojis.warning}`,
            description: `Click to see the general section!`,
            value: `general`
        })
        dropdowns.push({
            label: `Statistics`,
            emoji: `${client.custom_emojis.warning}`,
            description: `Click to see the statistics section!`,
            value: `statistics`
        })
        categorys.push(` > ${client.custom_emojis.warning} **• General**\n > ${client.custom_emojis.warning} **• Statistics**\n`)
        fs.readdirSync(`${process.cwd()}/src/commands`).forEach((dir) => {
            let dirEmojis = require(`../../utils/diremojis`)
            const commandLength = fs.readdirSync(`${process.cwd()}/src/commands/${dir}`).length
            dropdowns.push({
                label: `${client.utils.formatUnderlines(dir)}`,
                emoji: `${dirEmojis[dir.toLowerCase()]}`,
                description: `Click this to get ${client.utils.formatUnderlines(dir.toLowerCase()).toLowerCase()} commands!`,
                value: `${dir.toLowerCase()}`
            })
            categorys.push(` > ${dirEmojis[dir.toLowerCase()]} • **${client.utils.formatUnderlines(dir.toLowerCase())}** - ${commandLength} commands!`)
           
        })
        

        let row = new MessageActionRow()
        .addComponents([
            new MessageSelectMenu()
            .setPlaceholder("Choose...")
            .setCustomId("help_menu")
            .addOptions(dropdowns)
        ])
    
        
        const embed = new MessageEmbed()
        .setTitle(` > ${client.user.username}'s help panel!`)
        .setDescription(`${categorys.join("\n")}`)
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        message.reply({embeds: [embed], components: [row]})
        } else {
            const cmdname = args.join(" ").toLowerCase()
            const command = client.commands.find(c => c.name === cmdname || c.aliases?.includes(cmdname))

            if(!command) {
                return message.reply({content: `${client.custom_emojis.cross} • This is not a valid command!`})
            }

            const embed = new MessageEmbed()
            .setTitle(` > Command information`, client.user.displayAvatarURL())
            .setDescription(` > ${client.custom_emojis.warning} ** • Name:** ${command.name}\n > ${client.custom_emojis.warning} ** • Description:** ${command.description || "No description"}\n > ${client.custom_emojis.warning} ** • Aliases:**  ${command.aliases || "No aliases"}\n > ${client.custom_emojis.warning} ** • Usages:** ${command.usages || "No usages"}\n > ${client.custom_emojis.warning} ** • Permissions:**  ${command.userPermissions || "None"}`)
            .setColor(client.colors.pink)
            .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

            return message.reply({embeds: [embed]})
        }
       
    }
}