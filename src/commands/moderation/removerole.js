const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "removerole",
    description: "Remove a role from a user!",
    category: "Moderation",
    //aliases: ["removerole"],
    usages: ["<member> ? <role>"],
    botPermissions: ["MANAGE_ROLES"],
    userPermissions: ["MANAGE_ROLES"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args, {prefix}) => {
        let arg = args.join(" ").split(" ? ")
        if(!arg[0] || !arg[1]) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid member and role! (use \`${prefix}help addrole\` to see its usaages!)`})
        }
        let member = message.mentions.channels.first() || message.guild.members.cache.find(m => m.id === arg[0].toLowerCase() || m.user.username.toLowerCase() === args[0].toLowerCase() || m.user.tag.toLowerCase() === args[0].toLowerCase())
        let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id === arg[1].toLowerCase() || r.name.toLowerCase() === arg[1].toLowerCase())
        if(!member || !role) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid member and role! (use \`${prefix}help addrole\` to see its usaages!)`})
        }

        if(role.position >= message.guild.me.roles.highest.position) {
            return message.reply({content: `${client.custom_emojis.cross} • Missing permissions! Please move my role higher than the mentioned role!`})
        }

        const embed = new MessageEmbed()
        .setAuthor(`Role Removed!`, client.user.displayAvatarURL())
        .setDescription(`Successfully removed role <@&${role.id}> (\`${role.id}\`) from <@${member.id}> (\`${member.id}\`)`)
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        member.roles.remove(role)
        return message.reply({embeds: [embed]})




    }
}