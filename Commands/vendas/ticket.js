const Discord = require("discord.js");
const { MessageSelectMenu, MessageActionRow } = require("discord.js");
//Função adicionada & melhorada por LucasFlux#0089

module.exports = {
    name: "ticketsetup",
    author: "lucasflux",

    run: async(client, message, args) => {

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply(`Apenas membros com a permissão de \`ADMINISTRADOR\`, poderão utilizar este comando.`);

        message.delete();

        let embed = new Discord.MessageEmbed()
        .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
        .setFooter('Atenciosamente, Suporte Tecnico Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
        .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
        .setColor("RANDOM")
        .setDescription(`🎧**・Suporte Tecnico** \n ✉️・Abra um ticket:`)
        .setAuthor("Flux Store", message.guild.iconURL({ dynamic: true }));


        let painel = new MessageActionRow().addComponents( new MessageSelectMenu()
        .setCustomId('menu')
        .setPlaceholder('Clique aqui.')
        .addOptions([
               {
                    label: '・Suporte Compras',
                    description: '',
                    emoji: '🛒',
                    value: 'geral',
               },
               {
                label: '・Denúncias',
                description: '',
                emoji: '⛔',
                value: 'denuncias',
               },
               {
                label: '・Erros no bot',
                description: '',
                emoji: '🤖',
                value: 'bot',
               }
            ])

        );

        message.channel.send({ embeds: [embed], components: [painel] }).then(msg => {


            const filtro = (interaction) => 
            interaction.isSelectMenu()
      
          const coletor = msg.createMessageComponentCollector({
            filtro
          });
      

          coletor.on('collect', async (collected) => {

            let ticket = collected.values[0]
            collected.deferUpdate()

            if (ticket === "geral") {

                let embed_geral = new Discord.MessageEmbed()
                .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
                .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
                .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
        
                .setColor("RANDOM")
                .setDescription(`🛒・${collected.user} o ticket foi criado em relação a: **Suporte Compras**.\n 🎧・Aguarde, logo você será atendido!`);

                message.guild.channels.create(`${collected.user.username}`, {
                    type : 'GUILD_TEXT',
                    permissionOverwrites : [
                        {
                            id : message.guild.id,
                            deny : ['VIEW_CHANNEL']
                        },
                        {
                            id : collected.user.id,
                            allow : ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES']
                        }
                    ]
                }).then(async (chat_lucasflux) => {
        
                    chat_lucasflux.send({ embeds: [embed_geral] }).then(msg => msg.pin() );
        
                });


            }
            else if (ticket === "denuncias") {

                let embed_denuncias = new Discord.MessageEmbed()
                .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
                .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
                .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
        
                .setColor("RANDOM")
                .setDescription(`⛔・${collected.user} o ticket foi criado em relação a: **Denúncias**. \n 🎧・Aguarde, logo você será atendido!`);

                message.guild.channels.create(`${collected.user.name}`, {
                    type : 'GUILD_TEXT',
                    permissionOverwrites : [
                        {
                            id : message.guild.id,
                            deny : ['VIEW_CHANNEL']
                        },
                        {
                            id : collected.user.id,
                            allow : ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES']
                        }
                    ]
                }).then(async (chat_lucasflux) => {
        
                    chat_lucasflux.send({ embeds: [embed_denuncias] }).then(msg => msg.pin() );
        
                });
            }

            else if (ticket === "bot") {

                let embed_bot = new Discord.MessageEmbed()
                .setThumbnail('https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
                .setFooter('Atenciosamente, Flux Store.', 'https://media.discordapp.net/attachments/947938720747761705/986855893373173770/standard_1.gif')
                .setImage('https://cdn.discordapp.com/attachments/947938720747761705/986854936086200340/standard.gif')
        
                .setColor("RANDOM")
                .setDescription(`🤖・${collected.user} o ticket foi criado em relação a: **Erro no bot**.\n 🎧・Aguarde, logo você será atendido!`);

                message.guild.channels.create(`${collected.user.name}`, {
                    type : 'GUILD_TEXT',
                    permissionOverwrites : [
                        {
                            id : message.guild.id,
                            deny : ['VIEW_CHANNEL']
                        },
                        {
                            id : collected.user.id,
                            allow : ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES']
                        }
                    ]
                }).then(async (chat_lucasflux) => {
        
                    chat_lucasflux.send({ embeds: [embed_bot] }).then(msg => msg.pin() );
        
                });
            }
          })
        });
    }
}