/* eslint-disable no-useless-escape */
// eslint-disable-next-line no-unused-vars
const { Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, TextChannel } = require('discord.js');
const { Produto, ProdutoEstoque, MsgProduto } = require('../../models/vendas');
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
      .setColor(config.color).setDescription(`Não há produtos cadastrados no momento.\nUtilize \`${config.prefix}produtocadastrar\` para começar.`)]});

      const embedBase = new MessageEmbed()
      .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
        .setColor(config.color)
          .setDescription(`Selecione um produto no **menu** abaixo.\n**AVISO**: ao selecionar, todo o estoque do produto será deletado.`)

    const menuRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('remover_produto')
                .setPlaceholder('Selecionar um produto')
                .addOptions(produtos
                    .map(produto => ({

                        label: `${produto.nome} [R$${produto.valor}]`,
                        value: `${produto._id}`,
                    })
                    )
                )
        );

    const rowCancelar = new MessageActionRow()
        .addComponents(

            new MessageButton()
                .setCustomId('remover_cancelar')
                .setStyle('DANGER')
                .setLabel('Cancelar')
        );

    const msgMenu = await message.reply({ embeds: [embedBase], components: [menuRow]});

    const menuCollector = message.channel.createMessageComponentCollector({
        filter: i => [ 'remover_produto', 'remover_cancelar' ].includes(i.customId),
        max: 1,
        idle: 10_000
    });

    menuCollector.on('collect', async i => {

        if (i.isButton() && i.custom.id === 'remover_cancelar') {


        }

        if (!i.isSelectMenu()) return;


        const itemSelecionado = produtos.find(p => `${p._id}` === i.values[0]);


        const filtroBuscaMsg = { produtoId: itemSelecionado._id, server_id: message.guildId };
        await Produto.deleteOne(filtroBuscaMsg); // Removendo produto
        await ProdutoEstoque.deleteMany(filtroBuscaMsg); // Tacando fogo no estoque

        /** @type {{canal_id: String, msg_id: String, server_id: String, produtoId: Number}} */
        const msgProduto = await MsgProduto.findOne(filtroBuscaMsg);

        await i.deferUpdate();

        if (msgProduto) {

            try {
                /** @type {TextChannel} */
                const canal = message.guild.channels.cache.get(msgProduto.canal_id);
                const msgRegistrada = await canal?.messages.fetch(msgProduto.msg_id);

                msgRegistrada.delete();
                msgMenu.delete();
                return;
            }
            catch (error) {

                await i.followUp({ embeds: [new MessageEmbed()
                    .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
                  .setColor(config.color).setDescription(`Ocorreu um erro ao **remover** o produto da database.`)], ephemeral: true});
                await MsgProduto.deleteOne(filtroBuscaMsg);
                msgMenu.delete().catch(() => {});
                return;
            }

        }


        await i.followUp({ embeds: [new MessageEmbed()
            .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
          .setColor(config.color).setDescription(`Produto removido da database com **sucesso**.`)], ephemeral: true});
        msgMenu.delete();


    });

};


module.exports = {    
    run,
    name: 'produtoremover',
    aliases: ["premover", "produtor", "premove", "prmv"],
};