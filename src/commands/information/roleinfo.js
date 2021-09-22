const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "roleinfo",
    description: "See information on a role",
    category: "Information",
    aliases: ["ri"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let role = 
        message.mentions.roles.first() ||
        message.guild.roles.cache.find(r => r.id === args.join(" ") || r.name.toLowerCase() === args.join(" ").toLowerCase())

        if(!role) {
            const embed = new MessageEmbed()
            .setAuthor(`Missing required arguments!`, client.user.displayAvatarURL())
            .setDescription(`Please supply a role! (this could be a role name, id or mention!)`)
            .setColor(client.colors.red)
            .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

            return message.reply({embeds: [embed]})
        }

        let rolePerms = []
        role.permissions.toArray().forEach((p) => {
            const everyoneRole = message.guild.roles.cache.find(r => r.id === message.guild.id)
            if(everyoneRole.permissions.toArray().includes(p)) {
                return;
            } else {
                rolePerms.push(client.utils.formatUnderlines(p))
            }
        })
        const embed = new MessageEmbed()
        .setAuthor(role.name, client.user.displayAvatarURL())
        .addFields(
            {name: "Mention & ID", value: `<@&${role.id}> (\`${role.id}\`)`},
            {name: "Mentionable", value: `${client.utils.formatString(String(role.mentionable))}`, inline: true},
            {name: "Posistion", value: `${role.position}`, inline: true},
            {name: "Color", value: `${role.hexColor}`, inline: true},
            {name: "Created", value: `<t:${Math.round(role.createdTimestamp / 1000)}:d>`, inline: true},
            {name: "Hoisted", value: `${client.utils.formatString(String(role.hoist))}`, inline: true},
            {name: "Permissions", value: `${rolePerms.join(", ")}`}
        )
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

            return message.reply({embeds: [embed]})
    }
}