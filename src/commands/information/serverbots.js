const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "serverbots",
    description: "See all bots in the server!",
    category: "Information",
    // aliases: [],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let members = message.guild.members.cache.filter(u => u.user.bot).map((u) => `${u.user.tag} (\`${u.id}\`)`)
        const total_members = members.length
        members = total_members > 20 ? members.slice(0, 20).join("\n") : members.join("\n")
        if(members.length <= 0) {
            members = "No Bots"
        }

        const embed = new MessageEmbed()
        .setAuthor(`Bots found!`, client.user.displayAvatarURL())
        .setDescription(`there is a total of **${total_members}** bots in **${message.guild.name}**`)
        .addFields({name: "Bots", value: `${total_members > 20 ? `${members} and ${total_members - 20} more.` : members}`})
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        return message.reply({embeds: [embed]})
    }
}