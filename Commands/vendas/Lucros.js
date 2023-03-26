/* eslint-disable no-useless-escape */
// eslint-disable-next-line no-unused-vars
const { Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js');
const config = require("../../config.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB();


/**
* @param { Message } message
* @param { string[] } args
*/
const run = async (client, message, args) => {
    if (message.author.id !== config.owner) {
        return;
    }

    let lucros = await db.get(`lucros_${message.guild.id}`)
    let compras = await db.get(`comprasrecebidas_${message.guild.id}`)

    if(compras === null || undefined) {
        compras = `0`
    }

    if(lucros === null || undefined) {
        lucros = `0,00`
    }



    message.reply({ embeds: [new MessageEmbed()
        .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
        .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
        .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
        .setAuthor({name: `Flux Store`, iconURL: config.author})
      .setColor(config.color)
      .setDescription(`Lucros da loja **${message.guild.name}**:`).addFields(
        {
            name: `Lucro Total:`,
            value: `R$${lucros}`,
            inline: true
        },
        {
            name: `Compras Totais:`,
            value: `${compras}`,
            inline: true
        }
      ) ]})

}
module.exports = {	
    run,
    name: 'lucros',
    aliases: ["lucrosinfo", "valoreslucro", "lucrobot", "botlucro"],
};
