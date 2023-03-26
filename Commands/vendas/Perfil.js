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

    let User = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let valorgasto = await db.get(`valorgasto_${User.id}`)
    let comprasfeitas = await db.get(`compras_${User.id}`)

    if(comprasfeitas === null || undefined) {
        comprasfeitas = `0`
    }

    if(valorgasto === null || undefined) {
        valorgasto = `0`
    }




    message.reply({ embeds: [new MessageEmbed()
        .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
        .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
        .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
        .setAuthor({name: `Flux Store`, iconURL: config.author})
      .setColor(config.color)
      .setDescription(`Perfil de **${User.username}**:`).addFields(
        {
            name: `Valor Gasto:`,
            value: `R$${valorgasto}`,
            inline: true
        },
        {
            name: `Compras Feitas:`,
            value: `${comprasfeitas}`,
            inline: true
        }
      ) ]})

}
module.exports = {	
    run,
    name: 'perfil',
    aliases: ["profile", "valorgasto", "totalgasto", "gastonobot"],
};
