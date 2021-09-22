const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const jtcRooms = require(`../../schemas/joinToCreateRooms`)
client.on("voiceStateUpdate", async (oldState, newState) => {
    const guild = await guilds.findOne({guildId: newState.guild.id})
    if(guild.jtc) {
        if(!newState.guild.me.permissions.has("MOVE_MEMBERS") ||
        !newState.guild.me.permissions.has("MUTE_MEMBERS") ||
        !newState.guild.me.permissions.has("DEAFEN_MEMBERS") ||
        !newState.guild.me.permissions.has("MANAGE_CHANNELS")
        ) {
            const controlChannels = await newState.guild.channels.cache.find(c => c.id === guild.jtc_channel)
            return controlChannels.send({content: `${client.custom_emojis.cross} • I do not have my required permissions to use this system! Please make sure i have the "Move Members, Mute Members, Defean Members and Manage Channels" Permissions`})
        }



        const user = await client.users.fetch(newState.id)
        const member = newState.guild.members.cache.find(m => m.id === user.id)

        if(!newState.channel) {
           
            const usersRoom = await jtcRooms.findOne({userId: member.id, guildId: oldState.guild.id})
            if(usersRoom) {
                if(oldState.channel) {
                    if(oldState.channel.id === usersRoom.roomId) {
                        await jtcRooms.findOneAndRemove({userId: member.id, guildId: oldState.channel.guild.id})
                        oldState.channel.delete().catch(() => {})  
                    }
                }
            }
            return;
        }

        if(!oldState.channel && newState.channel.id === guild.jtc_channel) {
            const channel = await newState.guild.channels.create(`${member.user.tag}`, {
                type: "GUILD_VOICE",
                parent: newState.channel.parentId
            })
            member.voice.setChannel(channel);
            await jtcRooms.create({
                userId: member.id,
                guildId: newState.guild.id,
                roomId: channel.id,
                
            })
            return;
        } 

     
    }
})