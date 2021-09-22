const client = require(`../../../index`)

client.on("messageUpdate", async (oldMessage, newMessage) => {
    if(newMessage.author.bot) return;
    if(!newMessage.content.length) return;

    client.emit("messageCreate", newMessage)
})