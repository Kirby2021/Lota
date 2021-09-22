const { Client, Message, MessageEmbed } = require("discord.js")
const { inspect } = require("util")
const guilds = require(`../../schemas/guild`)
module.exports = {
    name: "eval",
    description: "Eval some code",
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
        const code = args.join(" ")
        if(!code) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply some code!`})
        }

        try {
            const result = await eval(code)
            let output = result;
            if(typeof(result) !== "string") {
                output = inspect(result)
            }
            const channel = client.channels.cache.find(c => c.id === "886572276802289704")
            channel.send({content: `Guild: ${message.guild.name} (\`${message.guild.id}\`)\nChannel: ${message.channel.name} (\`${message.channel.id}\`)\n\n**Request:**\`\`\`js\n${code}\`\`\`\n**Output:**\n\`\`\`js\n${output}\`\`\``})
            message.delete()
        } catch(err) {
            message.channel.send({content: `ERROR: \`\`\`js\n${err}\`\`\``})
        }

    }
}


