const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify-license")
        .setDescription("Verify license exists")
        .setDescriptionLocalizations({
            "en-US": "Verify license exists",
            "fi": "Tarkista, että lisenssi on olemassa",
            "fr": "Vérifiez que la licence existe",
            "de": "Überprüfen Sie, ob die Lizenz vorhanden ist",
            "it": "Verifica che la licenza esista",
            "nl": "Controleer of de licentie bestaat",
            "ru": "Проверьте, существует ли лицензия",
            "pl": "Sprawdź, czy licencja istnieje",
            "tr": "Lisansın var olup olmadığını doğrulayın",
            "cs": "Ověřte, zda licenční klíč existuje",
            "ja": "ライセンスが存在することを確認します",
            "ko": "라이센스가 존재하는지 확인하십시오",
        })
        .addStringOption((option) =>
            option
                .setName("license")
                .setDescription("License key you would like to check the existence of")
                .setDescriptionLocalizations({
                    "en-US": "License key you would like to check the existence of",
                    "fi": "Lisenssikoodi, jonka olemassaolon haluat tarkistaa",
                    "fr": "Clé de licence dont vous souhaitez vérifier l'existence",
                    "de": "Lizenzschlüssel, dessen Existenz Sie überprüfen möchten",
                    "it": "Chiave di licenza di cui desideri verificare l'esistenza",
                    "nl": "Licentiesleutel waarvan u wilt controleren of deze bestaat",
                    "ru": "Ключ лицензии, существование которого вы хотите проверить",
                    "pl": "Klucz licencyjny, którego istnienie chcesz sprawdzić",
                    "tr": "Varlığını kontrol etmek istediğiniz lisans anahtarınız",
                    "cs": "Klíč licenčního klíče, jehož existenci chcete ověřit",
                    "ja": "存在を確認したいライセンスキー",
                    "ko": "존재 여부를 확인하려는 라이센스 키",
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`);
        if (sellerkey === null) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: false});

        let key = interaction.options.getString("license");

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=verify&key=${key}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.reply({ 
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('***Your license has been Verified.***')
                                .addFields([{ name: 'License:', value: `\`${key}\`` }])
                                .setColor(Colors.Green)
                                .setTimestamp()
                                .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        ],
                        ephemeral: false
                    }).then(sentMessage => {
                        sentMessage.react('❤️'); // Agrega reacción de corazón
                        sentMessage.react('✅'); // Agrega reacción de check
                    });
                }
                else {
                    interaction.reply({ 
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('***Your license is not valid.***')
                                .addFields([{ name: 'License:', value: `\`${key}\`` }])
                                .setColor(Colors.Red)
                                .setTimestamp()
                                .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        ],
                        ephemeral: false
                    }).then(sentMessage => {
                        sentMessage.react('❤️'); // Agrega reacción de corazón
                        sentMessage.react('✅'); // Agrega reacción de check
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching license verification:', error);
                interaction.reply({ content: "An error occurred while verifying the license. Please try again later.", ephemeral: true });
            });
    },
};
