const { Client, IntentsBitField, MessageEmbed } = require('discord.js');

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.Guild_Messages],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!fishparty') {
        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, { time: 15000 });

        let minPlayers;
        let maxPlayers;

        message.channel.send('What is the minimum number of players you want in your party?');
        collector.on('collect', (m) => {
            if (!isNaN(m.content)) {
                minPlayers = parseInt(m.content);
                message.channel.send('What is the maximum number of players you want in your party?');
                collector.stop();
            }
        });

        collector.on('end', async (collected) => {
            maxPlayers = parseInt(collected.last().content);

            // Search for available parties and format the message
            const parties = searchForParties(minPlayers, maxPlayers);
            const partyList = parties.map((party) => {
                return `${party.name} - ${party.currentPlayers}/${party.maxPlayers} players`;
            });

            // Create a custom embed with the party list
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Fishing Party Finder')
                .setDescription('React with 🎣 to join a party')
                .addFields(
                    { name: 'Available Parties', value: partyList.join('\n') },
                )
                .setThumbnail('https://i.imgur.com/4M34hi2.png');

            // Send the message and add a reaction for users to join the party
            const partyMessage = await message.channel.send({ embeds: [embed] });
            await partyMessage.react('🎣');

            const filter = (reaction, user) => {
                return reaction.emoji.name === '🎣' && !user.bot;
            };

            const collector = partyMessage.createReactionCollector({ filter, time: 15000 });

            collector.on('collect', (reaction, user) => {
                const party = getPartyFromMessage(partyMessage, reaction);
                party.addPlayer(user);
                const updatedPartyList = parties.map((party) => {
                    return `${party.name} - ${party.currentPlayers}/${party.maxPlayers} players`;
                });
                embed.fields[0].value = updatedPartyList.join('\n');
                partyMessage.edit({ embeds: [embed] });
            });
        });
    }
});

function searchForParties(minPlayers, maxPlayers) {
    // TODO: Implement this function
    return [];
}

function getPartyFromMessage(message, reaction) {
    // TODO: Implement this function
    return null;
}


client.login('MTE0MTExNjcxNDUwODExMTkzMw.GZRA0e.NYAIXCeQmFhksHlHZBcscOdBpEUqLWvEmkvXTA');



