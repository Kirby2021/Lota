const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "unban",
    description: "Unban a member!",
    category: "Moderation",
    // aliases: [],
    usages: ["<member> ? <reason>"],
    botPermissions: ["BAN_MEMBERS"],
    userPermissions: ["BAN_MEMBERS"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const arg = args.join(" ").split(" ? ")
        let member = await (await message.guild.bans.fetch()).find(b => b.id === arg[0] || b.user.username.toLowerCase() === arg[0].toLowerCase() || b.user.tag.toLowerCase() === arg[0].toLowerCase())
        if(!member) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid banned member!`})
        }
        let reason = arg[1] || "No reason"
        
        message.guild.members.unban(member.user.id, reason)

        const embed = new MessageEmbed()
        .setAuthor(`Unbanned Member!`, client.user.displayAvatarURL())
        .setDescription(`${client.custom_emojis.tick} • Succesfully unbanned ${member.user.tag} (\`${member.user.id}\`) from ${message.guild.name}`)
        .setColor(client.colors.pink)

        message.channel.send({embeds: [embed]})
        setTimeout(() => {
            message.delete().catch(() => {})
        }, 100);
    }
}