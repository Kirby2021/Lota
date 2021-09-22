const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "discrim",
    description: "Shows a list of members with the same discriminator",
    category: "Utils",
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
        if(!args.length) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid discriminator!`})
        }
        if(!/^\d{4}$/.test(args.join(" "))) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid discriminator!`})
        }

        let members = client.users.cache.filter(u => u.discriminator === args.join(" ")).map(user => user.tag)
        const total_members = members.length
        members = total_members > 20 ? members.slice(0, 20).join("\n") : members.join("\n")
        if(members.length <= 0) {
            members = "No members"
        }
        const embed = new MessageEmbed()
        .setAuthor(`Discriminators found!`, client.user.displayAvatarURL())
        .setDescription(`there is a total of **${total_members}** member(s) with the discriminator **${args.join(" ")}**`)
        .addFields({name: "Users", value: `${total_members > 10 ? `${members} and ${total_members - 20} more.` : members}`})
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        return message.reply({embeds: [embed]})

    }
}