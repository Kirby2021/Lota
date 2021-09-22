/*const client = require(`../../../index`)
const { Interaction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
/**
 * @param {Interaction} interaction

client.on("interactionCreate", async (interaction) => {
    if(interaction.isSelectMenu()) {
        if(interaction.customId === "bot_faq_and_info") {
            if(interaction.values.includes("general")) {
                let totalCommands = 0
                client.commands.each((c) => {
                    totalCommands++
                })
                let sorted_servers = client.guilds.cache.sort((a, b) => a.memberCount - b.memberCount)
                let top_server = sorted_servers.map((s) => s)
                const embed = new MessageEmbed()
                .setAuthor(`${client.user.username}'s General Information!`, client.user.displayAvatarURL())
                .setDescription(` • Commands: **${totalCommands}**\n • Creation: <t:1631218068:f>\n • Owner: **|| hidden ;) ||**\n • Users: **${client.users.cache.size}**\n • Servers: **${client.guilds.cache.size}**\n • Emojis: **${client.emojis.cache.size}**\n • Top server: **${top_server[0].name} (${top_server[0].memberCount} members)**`)
                .setColor(client.colors.pink)

                return interaction.reply({embeds: [embed], ephemeral: true})
            } 
            if(interaction.values.includes("features")) {
                const embed = new MessageEmbed()
                .setAuthor(`${client.user.username}'s Features!`, client.user.displayAvatarURL())
                .setDescription(` • Auto moderation\n • Custom commands\n • Suggestions System\n • Moderation\n • Role management\n • Utilites\n • Leveling\n • Advanced moderation logs\n • Auto reactions`)
                .setColor(client.colors.pink)

                return interaction.reply({embeds: [embed], ephemeral: true})
            }
            if(interaction.values.includes("statistics")) {
                let sorted_servers = client.guilds.cache.sort((a, b) => a.memberCount - b.memberCount)
                let top_server = sorted_servers.map((s) => s)
                let data = await client.clientSchema.findOne({clientId: client.user.id})
                let mostRecentGuild = client.guilds.cache.find(g => g.id === data.mostRecentServer[0])
                const embed = new MessageEmbed()
                .setAuthor(`${client.user.username}'s Statistic!`, client.user.displayAvatarURL())
                .setDescription(` • **Users:**\nBots: ${client.users.cache.filter(u => u.bot).size}\nHumans: ${client.users.cache.filter(u => !u.bot).size}\nTotal: ${client.users.cache.size}\n\n • **Servers:**\nTop server: ${top_server[0].name} (${top_server[0].memberCount} members)\nMost recent: ${mostRecentGuild.name || "No data"} (${mostRecentGuild.memberCount || "No data"} members)\nTotal: ${client.guilds.cache.size}\n\n • **Other**\n Total Emojis: ${client.emojis.cache.size}`)
                .setColor(client.colors.pink)

                return interaction.reply({embeds: [embed], ephemeral: true})
            }
            if(interaction.values.includes("links")) {
                let row = new MessageActionRow()
                .addComponents([
                    new MessageButton()
                    .setLabel("Invite")
                    .setStyle("LINK")
                    .setURL("https://discord.com/api/oauth2/authorize?client_id=885567488761397338&permissions=8&scope=bot")
                ])
                const embed = new MessageEmbed()
                .setAuthor(`${client.user.username}'s Links!`, client.user.displayAvatarURL())
                .setColor(client.colors.pink)

                return interaction.reply({embeds: [embed], ephemeral: true, components: [row]})
            }
        }
    }
})
*/