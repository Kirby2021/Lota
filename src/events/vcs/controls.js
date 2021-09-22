const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const jtcRooms = require(`../../schemas/joinToCreateRooms`)

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()) {
        
        if(interaction.customId.startsWith("jtc_")) {
            const member = interaction.guild.members.cache.find(m => m.id === interaction.user.id)
            
            if(member.voice.channel) {
                const user = await jtcRooms.findOne({userId: member.id, roomId: member.voice.channel.id})
                if(user) {
                    require(`../../functions/vc_functions/${interaction.customId.slice(4)}.js`)(interaction,client)
                } else {
                    interaction.reply({content: `${client.custom_emojis.cross} • You must be the owner of the vc to use these interactions!`, ephemeral: true})
                }
            } else {
                interaction.reply({content: `${client.custom_emojis.warning} • You are not in a vc!`, ephemeral: true})
            }
        }
    }
})