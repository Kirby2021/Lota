const { Client, Message, MessageEmbed } = require("discord.js")
const ClientSchema = require(`../../schemas/Client`)
module.exports = {
    name: "blacklistcommand",
    description: "Add / Remove a blacklisted command",
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
            const validCommand = client.commands.find(cmd => cmd.name.toLowerCase() === args[1].toLowerCase() || cmd.aliases?.includes(args[1].toLocaleLowerCase()))
            if(!validCommand) {
                const embed = new MessageEmbed()
                .setDescription(` >  ${client.custom_commands.cross} • Please supply a valid command!`)
                .setColor(client.colors.pink)
    
                return message.reply({embeds: [embed]})
            }

            await ClientSchema.findOneAndUpdate({clientId: client.id}, {
                $push: {
                    blackListedCmds: [validCommand.name]
                }
            })

            const embed = new MessageEmbed()
            .setDescription(` >  ${client.custom_commands.ticked} • Command \`${validCommand.name}\` has been added to the blacklisted list!`)
            .setColor(client.colors.pink)

            return message.reply({embeds: [embed]})
        }
        if(args[0].toLowerCase() === "remove") {
            const validCommand = client.commands.find(cmd => cmd.name.toLowerCase() === args[1].toLowerCase() || cmd.aliases?.includes(args[1].toLocaleLowerCase()))
            if(!validCommand) {
                const embed = new MessageEmbed()
                .setDescription(` >  ${client.custom_commands.cross} • Please supply a valid command!`)
                .setColor(client.colors.pink)
    
                return message.reply({embeds: [embed]})
            }
            const clientschema = await ClientSchema.findOne({clientId: client.id})
            if(!clientschema.blackListedCmds.includes(validCommand.name)) {
                const embed = new MessageEmbed()
                .setDescription(` >  ${client.custom_commands.cross} • Please supply a valid blacklisted command!`)
                .setColor(client.colors.pink)
    
                return message.reply({embeds: [embed]})
            }
            await ClientSchema.findOneAndUpdate({clientId: client.id}, {
                $pull: {
                    blackListedCmds: [validCommand.name]
                }
            })

            const embed = new MessageEmbed()
            .setDescription(` >  ${client.custom_commands.ticked} • Command \`${validCommand.name}\` has been removed from the blacklisted list!`)
            .setColor(client.colors.pink)

            return message.reply({embeds: [embed]})
        }
    }
}