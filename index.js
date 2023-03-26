const { Client, Intents, Collection } = require("discord.js");
const { connect } = require('mongoose')


const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MEMBERS
  ]
});
const logs = require('discord-logs');
logs(client, {
    debug: true
}); 
const config = require("./config.json");
connect(config?.mongo_url || process.env.mongo_url).then(() => console.log('MongoDB Connected Successfully!'))
const cooldowns = new Map();
module.exports = client;

client.login(config.token);

client.once("ready", async () => {

  console.log(`🎄・[BOT] Online.\n🤖・[DEV] K4MI ⸸#8166`);
});

const fs = require("fs");

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync(`./Commands/`);

fs.readdirSync("./Commands/").forEach((local) => {
  const comandos = fs
    .readdirSync(`./Commands/${local}`)
    .filter((arquivo) => arquivo.endsWith(".js"));

  for (let file of comandos) {
    let puxar = require(`./Commands/${local}/${file}`);

    if (puxar.name) {
      client.commands.set(puxar.name, puxar);
    }
    if (puxar.aliases && Array.isArray(puxar.aliases))
      puxar.aliases.forEach((x) => client.aliases.set(x, puxar.name));
  }
});


///RODAR COMANDOS
client.on("messageCreate", async (message) => {
  if (message.author.bot || message.channel.type == "DM") return;


  let prefix = config.prefix;

  if (
    message.content == `<@${client.user.id}>` ||
    message.content == `<@!${client.user.id}>`
  ) {
    let embedmention = new Discord.MessageEmbed()
    .setFooter("🤖∙ discord.gg/neshastore")
    .setAuthor({
      name: `Quick Axis`,
      iconURL: config.author})
    .setColor(config.color)
      .setDescription(
        `Olá **${message.author.username}**, I am the exclusive bot of **${config.author}**.\I was developed by **[K4MI ⸸#8166](https://discord.gg/painarmyop)**. my prefix is **${prefix}**`
      );

    /*message.reply({ embeds: [embedmention] });*/
  }

  if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);

  const cooldown = cooldowns;

  const now = Date.now();
  const timestamps = cooldown.get(message.author.id);
  const cooldownAmount = 3000;

  if (timestamps && cooldown.has(message.author.id)) {
    const expirationTime = cooldown.get(message.author.id) + cooldownAmount;

    let embedcd = new Discord.MessageEmbed()
    .setFooter("∙ https://discord.gg/quickaxis")
    .setAuthor({
      name: `Quick Axis`,
      iconURL: config.author})
    .setColor(config.color)
      .setDescription(
        `You must **wait** a few seconds before using a command again.`
      );

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      /*/return message
        .reply({ embeds: [embedcd] })
        .then((message) => setTimeout(() => message.delete(), 3000));/*/
    }
  }

  if (!cooldown.has(message.author.id)) {
    cooldown.set(message.author.id, Date.now());

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, cooldownAmount);
  }

  let cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  try {
    command.run(client, message, args);
  } catch (err) {
    console.error("🚨 » [ERROR] " + err);
  }
});

////STATUS
client.on("ready", () => {
  const users = client.guilds.cache.map((g) => g.memberCount);

  let activities = [`💞・Flash Deliveries ☀️`, `💸・Receiving payments`],
    i = 0;
  setInterval(
    () =>
      client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "PLAYING",
      }),
    15000
  );
  client.user.setStatus("online");
});


///ANTI-CRASH
process.on("multipleResolves", (type, reason, promise) => {
  console.log(`🚨 » [ERRO]\n\n` + type, promise, reason);
});
process.on("unhandRejection", (reason, promise) => {
  console.log(`🚨 » [ERRO]\n\n` + reason, promise);
});
process.on("uncaughtException", (error, origin) => {
  console.log(`🚨 » [ERRO]\n\n` + error, origin);
});
process.on("uncaughtExceptionMonitor", (error, origin) => {
  console.log(`🚨 » [ERRO] \n\n` + error, origin);
});



/* eslint-disable no-useless-escape */
// eslint-disable-next-line no-unused-vars
const { Interaction, MessageAttachment, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { Buffer } = require('buffer');
const { Pagamento, Produto, ProdutoEstoque, MsgProduto } = require('./models/vendas');
const mercadopago = require('mercadopago');
const { accessToken } = require('./config.json');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

mercadopago.configure({
    access_token: accessToken
});


client.on("interaction", async (interaction) => {

        /** @typedef {Object} Produto
         * @property {Number} _id
         * @property {String} nome
         * @property {String} server_id
         * @property {Number} valor
         * @property {Number} quantidade
         */

        /** @typedef {Object} MsgProduto
         * @property {String} canal_id
         * @property {String} msg_id
         * @property {String} server_id
         * @property {Number} produtoId
         */

        if (interaction.isButton()) {

            //const LogsDb = await db.get(`logs_vendas${interaction.guild.id}`)
            const canalLogsCompras = interaction.guild.channels.cache.get(config.canalLogsCompras); 

            //const CargoCliente = await db.get(`cargocliente_${interaction.guild.id}`)
            let Cliente = client.guilds.cache.get(interaction.guild.id).roles.cache.get(config.tag_cliente);

            const button = interaction.customId;

            ///////////////////////////////////////
            const atualizarMgProduto = async (itemAtual) => {
                const embed = new MessageEmbed()
                .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
    .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
    .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
    .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color)
                    .setDescription(
                        `\`\`\`\ ${itemAtual.nome}\`\`\`\n`+
                        `💸・Value: \`R$${itemAtual.valor}\`\n🛒・Available Stock: \`${itemAtual.quantidade}\``
                    );

                /** @type {MsgProduto}*/
                const msgProduto = await MsgProduto.findOne({ server_id: interaction.guildId, produtoId: itemAtual._id });

                if (!msgProduto) return;

                /** @type {TextChannel} */
                const canal = interaction.guild.channels.cache.get(msgProduto.canal_id);
                if (!canal) return console.log('Product stock update channel');

                canal.messages.fetch(msgProduto.msg_id)
                    .then(async m => {
                        await m.edit({ embeds: [embed] });
                        console.log('Product stock message successfully updated');
                    })
                    .catch(() => console.log('Error updating product stock message'));
            };
            ///////////////////////////////////////

            if (button.startsWith('to check-')) {

                const [, pagamentoId ] = button.split('-');

                const res = await mercadopago.payment.get(Number(pagamentoId));
                const pagamentoStatus = res.body.status;

                await interaction.deferUpdate();
                if (pagamentoStatus === 'approved') {

                    /** @type {Produto} */
                    const produto = await Produto.findOne({ server_id: interaction.guildId, _id: Number(pagamentoId) });
                    await Pagamento.updateOne({ _id: Number(pagamentoId) }, {
                        pagamento_confirmado: true,
                        data: res.body.date_approved
                    });

                    const produtoComprado = await ProdutoEstoque.findOne({ server_id: interaction.guildId, produtoId: produto._id });

                    interaction.user.send({ embeds: [                                        new MessageEmbed()
                      .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                      .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                      .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                      .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color)
                        .setDescription(`Thank you for shopping at **${interaction.guild.name}**.\nnHere is your product: \`\`\`${produtoComprado.conteudo}\`\`\``)]})
                        .then(async () => {

                            await interaction.followUp({ content: `${interaction.user} check your DM`, ephemeral: true });
                            await ProdutoEstoque.deleteOne({
                                produtoId: produto._id,
                                server_id: interaction.guildId,
                                conteudo: produtoComprado.conteudo
                            });

                            produto.quantidade--;
                            await Produto.updateOne(
                                {
                                    _id: produto._id,
                                    server_id: interaction.guildId
                                },
                                {
                                    quantidade: produto.quantidade
                                }
                            );

                            atualizarMgProduto(produto);
                            
                        }
                        )
                        .catch(() => interaction.followUp({ embeds: [ new MessageEmbed()
                          .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                          .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                          .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                          .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color).setDescription(`There was an error sending the **product** in your DM. Is it open?`)],
                            ephemeral: true }));
                }
            }

            if (button.startsWith('pix')) {

                /** @type {Produto[]} */
                const itens = await Produto.find({ server_id: interaction.guildId });

                if (itens.length < 1) return interaction.reply({ embeds: [ new MessageEmbed()
                  .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                  .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                  .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                  .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color).setDescription(`There is no **registered** product in the bot.`)], ephemeral: true });

                const produtoId = Number(button.split('-')[1]);

                const { nome, valor, _id, quantidade } = itens.find(obj => obj._id === produtoId);

                const produtoComprado = await ProdutoEstoque.findOne({ produtoId: _id, server_id: interaction.guildId });

                if (!produtoComprado) return interaction.reply({ embeds: [new MessageEmbed()
                  .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                  .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                  .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                  .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color).setDescription(`Product \`${nome}\` is currently out of stock, please try again later.`)], ephemeral: true });


                try {

                    const email = 'sahildeep00924@gmail.com'; // Email qualquer aqui

                    const payment_data = {
                        transaction_amount: valor,
                        description: nome,
                        payment_method_id: 'pix',
                        payer: {
                            email,
                            first_name: `${interaction.user.tag} (${interaction.user.id})`,
                        }
                    };

                    const data = await mercadopago.payment.create(payment_data);                    
                    const base64_img = data.body.point_of_interaction.transaction_data.qr_code_base64;

                    const buf = Buffer.from(base64_img, 'base64');
                    const attachment = new MessageAttachment(buf, 'qrcode.png');

                    await Pagamento.create({
                        _id: parseInt(data.body.id),
                        user_id: interaction.user.id,
                        pagamento_confirmado: false,
                    });

                    let EmbedQrCode = new MessageEmbed()
                    .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
    .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
    .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
    .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color)
                    .setDescription(`Payment **PIX** generated in the amount of \`$${payment_data.transaction_amount}\`.\nPay for the Qr Code/Copy and Paste Code above.\n**LEAVE YOUR DM OPEN TO RECEIVE THE PRODUCT!**`)

                    await interaction.reply({files: [attachment], embeds: [new MessageEmbed().setDescription(`${data.body.point_of_interaction.transaction_data.qr_code}`).setColor(config.color), EmbedQrCode], ephemeral: true})

                    let tentativas = 0;
                    const interval = setInterval(async () => {
                    // Verificando se foi pago automaticamente
                    // console.log('tentativa: ', tentativas+1);
                        tentativas++;

                        const res = await mercadopago.payment.get(data.body.id);
                        const pagamentoStatus = res.body.status;

                        if (tentativas >= 5 || pagamentoStatus === 'approved') {

                            clearTimeout(interval);

                            if (pagamentoStatus === 'approved') {

                                interaction.editReply({ embeds: [new MessageEmbed()
                                  .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                  .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                  .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                                  .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color).setDescription(`Your payment has been received, I sent the product in your **DM**.`)], components: [], files: [], ephemeral: true})


                                await Pagamento.updateOne({ _id: Number(data.body.id) }, {
                                    pagamento_confirmado: true,
                                    data: res.body.date_approved
                                });
                                const categoriaProduto = itens.find(i => i._id === _id);

                                db.add(`compras_${interaction.user.id}`, 1)
                                db.add(`valorgasto_${interaction.user.id}`, valor)

                                db.add(`lucros_${interaction.guild.id}`, valor)
                                db.add(`comprasrecebidas_${interaction.guild.id}`, 1)

                                interaction.user.send({ embeds: [                                        new MessageEmbed()
                                  .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                  .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                  .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                                  .setAuthor({name: `Payment received`, iconURL: config.author})
      .setColor(config.color)
                                    .setDescription(`Thanks for shopping at **${interaction.guild.name}**. You have received the Customer tag! \nHere is your product: \`\`\`${produtoComprado.conteudo}\`\`\``)]})

                                    interaction.member.roles.add(Cliente, `New customer`);
                                    await canalLogsCompras
                                    ?.send({
                                        embeds: [
                                            new MessageEmbed()
                                            .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                            .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                            .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                                            .setAuthor({name: `Payment accept`, iconURL: config.author})
                                             .setColor(config.color)
                                            //.setDescription(`Produto: \`${nome}\`.\nValor: \`R$${valor.toFixed(2)}\`\nCliente: ${interaction.user.tag} \`(${interaction.user.id})\`\nData da Compra: <t:${~~(Date.now(1) / 1000)}:f>`)
                                            .addFields(
                                              {
                                                  name: `Product(s):`,
                                                  value: `\`${nome}\``,
                                                  inline: true
                                              },
                                              {
                                                  name: `Price:`,
                                                  value: `\`R$${valor.toFixed(2)}\``,
                                                  inline: true
                                              },
                                              {
                                                  name: `Amount:`,
                                                  value: `\`${quantidade}\``,
                                                  inline: false
                                              },
                                              {
                                                  name: `Client:`,
                                                  value: `\`${interaction.user.tag}\` [${interaction.user.id}]`,
                                                  inline: false
                                              },
                                              {
                                                  name: `Purchase Time:`,
                                                  value: `<t:${~~(Date.now(1) / 1000)}:f>`,
                                                  inline: false
                                              },
              
                                          )
                                          ]
                                    })
.then(async () => {
                                        
                                        await ProdutoEstoque.deleteOne({
                                            produtoId: _id,
                                            server_id: interaction.guildId,
                                            conteudo: produtoComprado.conteudo
                                        });

                                        categoriaProduto.quantidade--;
                                        await Produto.updateOne(
                                            {
                                                _id,
                                                server_id: interaction.guildId
                                            },
                                            {
                                                quantidade: categoriaProduto.quantidade
                                            }
                                        );
                                        
                                        atualizarMgProduto(categoriaProduto);
                                    }
                                    )
                                    .catch(() => interaction.followUp({ embeds: [ new MessageEmbed()
                                      .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                      .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                      .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                                      .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color).setDescription(`There was an error sending the **product** in your DM. she is open?`)],
                                        ephemeral: true }));
                            }
                            else if (pagamentoStatus !== 'approved') {
                                interaction.followUp({ embeds: [ new MessageEmbed()
                                  .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                  .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                                  .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                                  .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color).setDescription(`If your product was not delivered automatically, use the button below to check **manually**.`)],
                                    ephemeral: true,
                                    components: [
                                        new MessageActionRow()
                                            .addComponents(
                                                new MessageButton()
                                                    .setCustomId(`to check-${data.body.id}`)
                                                    .setStyle('PRIMARY')
                                                    .setLabel('to check')
                                            )
                                    ]
                                });
                            }
                        }
                    }, 30_000);

                }
                catch (error) {
                        
                    interaction.reply({ embeds: [ new MessageEmbed()
                      .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                      .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                      .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                      .setAuthor({name: `Quick Axis`, iconURL: config.author})
      .setColor(config.color).setDescription(`There was an error processing the **payment**.`)],
                        ephemeral: true })
                        .catch(() => interaction.followUp({ embeds: [ new MessageEmbed()
                          .setThumbnail('https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                          .setFooter('Yours sincerely, Quick Axis.', 'https://cdn.discordapp.com/attachments/1046777510731452518/1089578545195536465/giphy_gn1.gif')
                          .setImage('https://cdn.discordapp.com/attachments/1089568523241652284/1089579793806262343/Axis.gif')
                          .setAuthor({name: `Quick Axis`, iconURL: config.author})
                              .setColor(config.color).setDescription(`There was an error processing the **payment**.`)],
                            ephemeral: true }));
                    console.log(error);
                }
            }
        }
    }
)
