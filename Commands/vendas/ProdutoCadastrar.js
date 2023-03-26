// eslint-disable-next-line no-unused-vars
const { Message, Modal, TextInputComponent, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Produto } = require('../../models/vendas');
const config = require("../../config.json");
/**
* @param { Message } message
* @param { string[] } args
*/
const run = async (client, message) => {

    if (message.author.id !== config.owner) {
        return;
    }

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('novo')
                .setLabel('Cadastrar')
                .setStyle('SECONDARY'),
        );

    let msgCadastrar = await message.reply({ embeds: [new MessageEmbed()
        .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
      .setColor(config.color)
      .setDescription(`Para cadastrar um novo produto, use o **botão** abaixo.`)], components: [row]});

    const i = await message.channel.awaitMessageComponent({
        filter: i => i.user.id === message.author.id,
        componentType: 'BUTTON'
    });

    const modal = new Modal()
        .setCustomId('novo_produto')
        .setTitle('Adicionando Produto');

    const nomeInput = new TextInputComponent()
        .setCustomId('nome_produto')
        .setLabel('Nome do Produto')
        .setRequired(true)
        .setMaxLength(50)
        .setStyle('SHORT');

    const valorInput = new TextInputComponent()
        .setCustomId('valor_produto')
        .setLabel('Valor do Produto (em 0,00)')
        .setRequired(true)
        .setMaxLength(50)
        .setStyle('SHORT')
        .setPlaceholder('50,00');

    modal.addComponents(
        new MessageActionRow().addComponents(nomeInput),
        new MessageActionRow().addComponents(valorInput),
    );

    i.showModal(modal);

    const modalInteraction = await i.awaitModalSubmit({ filter: i => i.user.id === message.author.id, time: 120_000 });

    const nome = modalInteraction.fields.getTextInputValue('nome_produto');
    const valor = modalInteraction.fields.getTextInputValue('valor_produto');

    await Produto.create({
        server_id: message.guildId,
        // eslint-disable-next-line no-useless-escape
        valor: Number(valor.replace(',', '.').replace(/[^\d\.]+/g, '')),
        nome,
    });


    const embed = new MessageEmbed()
    .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
    .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
    .setAuthor({name: `Flux Store`, iconURL: config.author})
      .setColor(config.color)
      .setDescription(`Novo produto cadastrado.\n\`${nome}\` | \`R$${valor}\``)

      await msgCadastrar.delete()
    modalInteraction.reply({ embeds: [ embed ], ephemeral: true });
};


module.exports = {
    run,
    name: 'produtocadastrar',
    aliases: ["pcadastrar", "produtoc", "pcadastro", "pcad"],
};
