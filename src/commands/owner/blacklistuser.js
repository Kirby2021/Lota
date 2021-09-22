const { Client, Message, MessageEmbed } = require("discord.js")
const ClientSchema = require(`../../schemas/Client`)
module.exports = {
    name: "blacklistuser",
    description: "Add / Remove a blacklisted user",
    category: "Owner",
    owner: true,
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
        if(!args.length || !["add","remove","set"].includes(args[0].toLowerCase())) {
            const embed = new MessageEmbed()
            .setDescription(` >  ${client.custom_commands.warning} • **Please supply a valid type**\n\n >  ${client.custom_commands.warning} • \`add\`,\`remove\``)
            .setColor(client.colors.pink)

            return message.reply({embeds: [embed]})
        }

        if(["add","set"].includes(args[0].toLowerCase())) {
            const member = message.mentions.members.first() || message.guild.members.cache.find(m => m.id === args[1] || m.user.username.toLowerCase() === args[1].toLowerCase()) || args[1]
            if(!member) {
                const embed = new MessageEmbed()
                .setDescription(` >  ${client.custom_commands.cross} • Please supply a valid user!`)
                .setColor(client.colors.pink)
    
                return message.reply({embeds: [embed]})
            }

            await ClientSchema.findOneAndUpdate({clientId: client.id}, {
                $push: {
                    blackListedUsers: [args[1]]
                }
            })

            const embed = new MessageEmbed()
            .setDescription(` >  ${client.custom_commands.ticked} • User \`${args[1]}\` has been added to the blacklisted list!`)
            .setColor(client.colors.pink)

            return message.reply({embeds: [embed]})
        }
        if(args[0].toLowerCase() === "remove") {
            
            if(!args[1]) {
                const embed = new MessageEmbed()
                .setDescription(` >  ${client.custom_commands.cross} • Please supply a valid user!`)
                .setColor(client.colors.pink)
    
                return message.reply({embeds: [embed]})
            }

            const clientschema = await ClientSchema.findOne({clientId: client.id})
            if(!clientschema.blackListedUsers.includes(args[1])) {
                const embed = new MessageEmbed()
                .setDescription(` >  ${client.custom_commands.cross} • Please supply a valid blacklisted user id!`)
                .setColor(client.colors.pink)
    
                return message.reply({embeds: [embed]})
            }
            await ClientSchema.findOneAndUpdate({clientId: client.id}, {
                $pull: {
                    blackListedCmds: [args[1]]
                }
            })

            const embed = new MessageEmbed()
            .setDescription(` >  ${client.custom_commands.ticked} • User \`${args[1]}\` has been removed from the blacklisted list!`)
            .setColor(client.colors.pink)

            return message.reply({embeds: [embed]})
        }
    }
}