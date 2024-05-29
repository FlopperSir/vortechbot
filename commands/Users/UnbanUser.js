const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban-user")
        .setDescription("Unban User")
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("The username of the user you would like to unban.")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let user = interaction.options.getString("username")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=unbanuser&user=${user}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ 
                        embeds: [
                          new EmbedBuilder()
                            .setTitle('***Your license has been unbanned.***')
                            .setColor(Colors.Green)
                            .setTimestamp()
                            .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        ],
                        ephemeral: ephemeral 
                      }).then(sentMessage => {
                        sentMessage.react('❤️'); // Agrega reacción de corazón
                        sentMessage.react('✅'); // Agrega reacción de check
                      });
                } else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `***ERROR***` }]).setColor(Colors.Red).setTimestamp().setFooter({ text: "CleanBan" })], ephemeral: ephemeral })
                }
            })
    },
};