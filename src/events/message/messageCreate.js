const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js")
const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const users = require(`../../schemas/users`)
const owners = ["808069825388609586","462936117596127232"]
let invite_link = "https://discord.com/api/oauth2/authorize?client_id=885567488761397338&permissions=8&scope=bot"
let support_link = "https://discord.gg/YTPGywHj9d"

client.on("messageCreate", async (message) => {
    const guild = await guilds.findOne({guildId: message.guild.id})
    if(!guild) { await guilds.create({guildId: message.guild.id})}

    let prefix = guild ? guild.prefix : "%"
    if(message.author.bot || !message.guild ) return;


    if(!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS")) {
        setTimeout(() => {
            if(!message.guild.me.permissions.has("SEND_MESSAGES") || !message.guild.me.permissions.has("EMBED_LINKS")) {
                message.guild.leave()
            }
        }, 60000 * 2);
    }

    const mentionRegex = RegExp(`^<@!?${client.user.id}>$`);
    if(message.content.match(mentionRegex)) {
        let totalCommands = 0
        client.commands.each((c) => totalCommands++)
        const embed = new MessageEmbed()
        .setDescription(` > ${client.custom_emojis.tick} • **Hello im ${client.user.username}**!\n\n > ${client.custom_emojis.warning} • You can see all my commands by running \`%help\`!\n > ${client.custom_emojis.warning} • I have a total of **${client.guilds.cache.size}** servers and **${client.users.cache.size}** users!\n > ${client.custom_emojis.warning} • ${totalCommands} commands!`)
        .setColor(client.colors.pink)
        const row = new MessageActionRow()
        .addComponents([
            new MessageButton() .setURL(invite_link) .setLabel("Invite") .setStyle("LINK"),
            new MessageButton() .setURL(support_link) .setLabel("Support") .setStyle("LINK")
        ])

        message.reply({embeds: [embed], components: [row]})
    }

    require(`../../functions/suggestions`).base(message, client)
    require(`../../functions/counting`)(message, client)
    require(`../../functions/afk`)(message)


    if(guild.auto_responders.length > 0) {
        guild.auto_responders.map((ar) => {
            if(ar.trigger.toLowerCase() === message.content.toLowerCase()) {
                return message.reply({content: ar.res})
            }
        })
    
    }




    if ( message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(prefix)) return;
    const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/);
    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));
    if (command) {
        const user = await users.findOne({userId: message.author.id, guildId: message.guild.id})
        if(!user) { await users.create({userId: message.author.id, guildId: message.guild.id})}

        if(command.owner) {
            if(!owners.includes(message.author.id)) {
                return;
            }
        }

        if(command.category.toLowerCase() === "administrator" || command.category.toLowerCase() === "admini") {
            if(!message.member.permissions.has("ADMINISTRATOR")) {
                const embed = new MessageEmbed()
                .setAuthor(`Failed to run command!`, client.user.displayAvatarURL())
                .setDescription(`You are missing the required permissions to use this command!`)
                .addFields({name: "Permissions", value: `Administrator`})
                .setColor(client.colors.red)

                return message.reply({embeds: [embed]})
            }
        }

        if(command.userPermissions) {
            let reqPerms = []
            command.userPermissions.forEach((p) => {
                reqPerms.push(client.utils.formatUnderlines(p))
            })
            if(!message.member.permissions.has(command.userPermissions || [])) {
                const embed = new MessageEmbed()
                .setAuthor(`Failed to run command!`, client.user.displayAvatarURL())
                .setDescription(`You are missing the required permissions to use this command!`)
                .addFields({name: "Permissions", value: `${reqPerms.join(", ")}`})
                .setColor(client.colors.red)

                return message.reply({embeds: [embed]})
            }
        }

        if(command.botPermissions) {
            let reqPerms = []
            command.botPermissions.forEach((p) => {
                reqPerms.push(client.utils.formatUnderlines(p))
            })
            if(!message.guild.me.permissions.has(command.botPermissions || [])) {
                return message.reply({content: `${client.custom_emojis.cross} • Iam are missing the required permissions to use this command!\n\n__**Permissions:**__\n${reqPerms.join("\n")}`})
            }
        }


        if(command.category.toLowerCase() === "nsfw") {
            if(!message.channel.nsfw) {
                return message.reply({content: `${client.custom_emojis.cross} • This command can only be ran in a NSFW channel!`})
            }
        }
        const props = {
            prefix: guild.prefix,
            guild: guild
        }
    
        await command.run(client, message, args, props);
    } else {
        guild.custom_commands.map((c) => {
            if(c.trigger.toLowerCase() === cmd.toLowerCase()) {
                return message.reply({content: `${c.res}`})
            }
        })

        if(guild.leveling) {
            if(message.author.bot) return;
            const userOnLevel = await users.findOne({userId: message.author.id, guildId: message.guild.id})
            if(!userOnLevel) { await users.create({userId: message.author.id, guildId: message.guild.id})}
            require(`../../functions/leveling`)(message, client)
        }
    }
})