/* eslint-disable no-useless-escape */
// eslint-disable-next-line no-unused-vars
const { Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js');
const { Produto, MsgProduto } = require('../../models/vendas');
const config = require("../../config.json");


/**
* @param { Message } message
* @param { string[] } args
*/
const run = async (client, message) => {

    if (message.author.id !== config.owner) {
        return;
    }

    /** @type {{ _id: Number, nome: String, server_id: String, valor: Number, quantidade: Number }[]} */
    const produtos = await Produto.find({ server_id: message.guildId });

    if (produtos.length < 1) return message.reply({ embeds: [new MessageEmbed()
        .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
      .setColor(config.color)
      .setDescription(`Não há produtos cadastrados no momento.\nUtilize \`${config.prefix}produtocadastrar\` para começar.`)]});

      const embedBase = new MessageEmbed()
      .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
        .setColor(config.color)
          .setDescription(`Selecione um produto no **menu** abaixo.\nAssim enviando o painel de compra neste canal.`)

    const menuRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('menu_produtos')
                .setPlaceholder('Selecionar um produto')
                .addOptions(produtos
                    .map(produto => ({

                        label: `${produto.nome} [R$${produto.valor}]`,
                        value: `${produto._id}`,
                    })
                    )
                )
        );

    const msgMenu = await message.channel.send({ embeds: [embedBase], components: [menuRow] });

    const menuCollector = message.channel.createMessageComponentCollector({
        filter: i => i.customId === 'menu_produtos',
        componentType: 'SELECT_MENU',
        max: 1,
        idle: 120_000
    });

    menuCollector.on('collect', async i => {

        const itemSelecionado = produtos.find(p => `${p._id}` === i.values[0]);

        console.log(itemSelecionado);

        const embed = new MessageEmbed()
        .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
          .setColor(config.color)
            .setDescription(
                `\`\`\`\ ${itemSelecionado.nome}\`\`\`\n`+
                `💸・Valor: \`R$${itemSelecionado.valor}\`\n🛒・Estoque Disponível: \`${itemSelecionado.quantidade}\``
            );

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setEmoji('<:pix_branco:989990687036551199>')
                    .setCustomId(`pix-${itemSelecionado._id}`)
                    .setLabel('Comprar')
            );

        const filtroBuscaMsg = { produtoId: itemSelecionado._id, server_id: message.guildId };

        /** @type {{canal_id: String, msg_id: String, server_id: String, produtoId: Number}} */
        const msgProduto = await MsgProduto.findOne(filtroBuscaMsg);

        await i.deferUpdate();

        if (msgProduto) {

            try {
                /** @type {TextChannel} */
                const canal = message.guild.channels.cache.get(msgProduto.canal_id);
                const msgRegistrada = await canal?.messages.fetch(msgProduto.msg_id);

                await i.followUp({ embeds: [new MessageEmbed()
                    .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                  .setColor(config.color)
                  .setDescription(`Esse produto já está em algum canal.\nClique [aqui](${msgRegistrada.url}) para ser direcionado á ele.`)], ephemeral: true});
                await msgMenu.delete();
                return;
            }
            catch (error) {

                await i.followUp({ embeds: [new MessageEmbed()
                    .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                  .setColor(config.color)
                  .setDescription(`Tentei procurar pela mensagem desse produto na database mas **não** encontrei.\nUse o comando novamente.`)], ephemeral: true});
                await MsgProduto.deleteOne(filtroBuscaMsg);
                await msgMenu.delete()
                return;
            }

        }

        const msgProdutoFinal = await message.channel.send({ components: [row], embeds: [embed] });

        await MsgProduto.create({
            canal_id: message.channelId,
            msg_id: msgProdutoFinal.id,
            server_id: message.guildId,
            produtoId: itemSelecionado._id,
        });

        await i.followUp({ embeds: [new MessageEmbed()
            .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
          .setColor(config.color)
          .setDescription(`Mensagem cadastrada com sucesso em <#${message.channel.id}>.`)], ephemeral: true});
          await msgMenu.delete()

    });

};


module.exports = {	
    run,
    name: 'criar',
    aliases: ["pcriar", "produtocriar", "produtocriar-config", "pconfig"],
};
