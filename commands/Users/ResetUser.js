const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reset-user")
        .setDescription("Reset a user")
        .setDescriptionLocalizations({
            "en-US": "Reset a user",
            "fi": "Nollaa käyttäjä",
            "fr": "Réinitialiser un utilisateur",
            "de": "Benutzer zurücksetzen",
            "it": "Reimposta un utente",
            "nl": "Reset een gebruiker",
            "ru": "Сбросить пользователя",
            "pl": "Zresetuj użytkownika",
            "tr": "Bir kullanıcıyı sıfırlayın",
            "cs": "Resetovat uživatele",
            "ja": "ユーザーをリセットする",
            "ko": "사용자를 재설정하십시오",
        })
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("Username of the user your are resetting HWID for.")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let un = interaction.options.getString("username")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resetuser&user=${un}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ 
                        embeds: [
                          new EmbedBuilder()
                            .setTitle('***Your license has been reset.***')
                            .addFields([{ name: 'License:', value: `\`${un}\`` }])
                            .setColor(Colors.Green)
                            .setTimestamp()
                            .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        ],
                        ephemeral: ephemeral 
                      }).then(sentMessage => {
                        sentMessage.react('❤️'); // Agrega reacción de corazón
                        sentMessage.react('✅'); // Agrega reacción de check
                      });
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `***ERROR***` }]).setColor(Colors.Red).setFooter({ text: "CleanBan" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};