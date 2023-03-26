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

    let LogsAtual = await db.get(`logs_vendas${message.guild.id}`)
    let ClienteCargo = await db.get(`cargocliente_${message.guild.id}`)

    if(LogsAtual === null || undefined) {
        LogsAtual = `Não configurado.`
    } else {
        LogsAtual = `<#${LogsAtual}>`
    }


    if(ClienteCargo === null || undefined ) {
        ClienteCargo = `Não configurado.`
    } else {
        ClienteCargo = `<@&${ClienteCargo}>`
    }

    let BotaoNome = new MessageButton()
    .setLabel("Alterar Nome")
    .setStyle("SECONDARY")
    .setCustomId("alterarnome")

    let BotaoAvatar = new MessageButton()
    .setLabel("Alterar Avatar")
    .setStyle("SECONDARY")
    .setCustomId("alteraravatar")

    let BotaoLogs = new MessageButton()
    .setLabel("Alterar Logs")
    .setStyle("SECONDARY")
    .setCustomId("alterarlogs")

    let ClienteBotao = new MessageButton()
    .setLabel("Cargo Cliente")
    .setStyle("SECONDARY")
    .setCustomId("clientecargo")


    let Row = new MessageActionRow()
    .addComponents(BotaoNome, BotaoAvatar, BotaoLogs, ClienteBotao)


    let Config = await message.reply({ embeds: [new MessageEmbed()
        .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
        .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
        .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
        .setAuthor({name: `Flux Store`, iconURL: config.author})
      .setColor(config.color).setDescription(`Painel de **Configuração**:\nCom os botões abaixo você pode alterar:\n\`nome e avatar do bot;\`\n\`cargo de cliente e canal de logs.\`\n\nLogs de **Compras** atualmente: ${LogsAtual}\n\Cargo de **Cliente** atualmente: ${ClienteCargo}`)], components: [Row]})


      const AvaliarColetor = Config.createMessageComponentCollector({
        componentType: "BUTTON",
      });
  
      AvaliarColetor.on("collect", async (interaction) => {
        if (message.author.id != interaction.user.id) { 
            return;
        }
        if (interaction.customId === "alterarnome") {
            let Nome = await interaction.reply({ content: `${interaction.user}`, embeds: [new MessageEmbed()
                .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
              .setColor(config.color).setDescription(`Envie aqui nesse canal o novo **nome** do bot.`)]})

            const collector = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1 });

                collector.on('collect', async m => {
                    await m.delete()
                    await interaction.editReply({ content: `${interaction.user}`, embeds: [new MessageEmbed()
                        .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                          .setColor(config.color).setDescription(`Nome editado com **sucesso** para \`${m.content}\`.`)]})
                    client.user.setUsername(m.content);
                    
                })
        }
        if (interaction.customId === "alteraravatar") {
            let Avatar = await interaction.reply({ content: `${interaction.user}`, embeds: [new MessageEmbed()
                .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                  .setColor(config.color).setDescription(`Envie aqui o link de uma imagem para ser o **avatar** do bot.`)]})
    
                const collector = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1 });
    
                    collector.on('collect', async m => {
                        await m.delete()
                        await interaction.editReply({ content: `${interaction.user}`, embeds: [new MessageEmbed()
                            .setAuthor({
                              name: `Bot de Vendas`,
                              iconURL: config.author})
                              .setColor(config.color).setDescription(`Avatar alterado com **sucesso** para [avatar](${m.content}).`)]})
                        client.user.setAvatar(m.content);
                    
                            })

        }

        if (interaction.customId === "alterarlogs") {
            let Avatar = await interaction.reply({ content: `${interaction.user}`, embeds: [new MessageEmbed()
                .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                  .setColor(config.color).setDescription(`Mencione ou envie o **ID** de um canal aqui para ser setado como as logs de compras.`)]})
    
                const collector = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1 });
    
                    collector.on('collect', async m => {
                        const batata = m.mentions.channels.first() ||
                        message.guild.channels.cache.get(m.content)

                        if(!batata) {
                            message.reply({  embeds: [new MessageEmbed()
                                .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                                  .setColor(config.color).setDescription(`Esse canal não é válido! Tem **certeza** que enviou corretamente?`)]})
                        } else {
                            await m.delete()
                        await interaction.editReply({ content: `${interaction.user}`, embeds: [new MessageEmbed()
                            .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                              .setColor(config.color).setDescription(`Canal de logs de compras editado com **sucesso**.`)]})
                    
                              db.set(`logs_vendas${interaction.guild.id}`, batata.id)
                            }
                            })

        }

        if (interaction.customId === "clientecargo") {

            let Avatar = await interaction.reply({ content: `${interaction.user}`, embeds: [new MessageEmbed()
                .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                  .setColor(config.color).setDescription(`Mencione ou envie o **ID** de um cargo aqui para ser setado como cargo de cliente.`)]})
    
                const collector = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1 });
    
                    collector.on('collect', async m => {
                        const batata = m.mentions.roles.first() ||
                        message.guild.roles.cache.get(m.content)

                        if(!batata) {
                            message.reply({ embeds: [new MessageEmbed()
                                .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                                  .setColor(config.color).setDescription(`Esse cargo não é válido! Tem **certeza** que enviou corretamente?`)]})
                        } else {
                            await m.delete()
                        await interaction.editReply({ content: `${interaction.user}`, embeds: [new MessageEmbed()
                            .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                              .setColor(config.color).setDescription(`Cargo de cliente editado com **sucesso**.`)]})
                    
                              db.set(`cargocliente_${interaction.guild.id}`, batata.id)
                            }
                            })

        }
    })

}
module.exports = {	
    run,
    name: 'botconfig',
    aliases: ["configbot", "botnome", "botavatar", "botconfig"],
};
