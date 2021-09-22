const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)

client.on("messageDelete", async (message) => {
    if(!message.guild) return;
    if(message.author) {
        await guilds.findOneAndUpdate({guildId: message.guild.id}, {
       
            snipe_message: [
                {
                    author: message.author.tag,
                    content: message.content,
                    avatar: message.author.displayAvatarURL({dynamic: true})
                }
            ]
           
        })
    }

})