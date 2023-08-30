
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder,  EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from your server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(true)),

        async execute(interaction) {
            const target = interaction.options.getUser('target');
		    const reason = interaction.options.getString('reason');

            const confirm = new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel(`Ban`)
                .setStyle(ButtonStyle.Danger);
        
            const cancel = new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Secondary);
        
            const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Ban Confirmation')
                .setDescription(`Are you sure you want to ban ${target.username} for reason: ${reason}?`);

            const response = await interaction.reply({
                embeds: [embed],
                components: [row],
                ephemeral: true
            });

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            
                if (confirmation.customId === 'confirm') {
                    await interaction.guild.members.ban(target);
                    await confirmation.update({ content: `${target.username} has been banned for reason: ${reason}`, components: [] });
                } else if (confirmation.customId === 'cancel') {
                    await confirmation.update({ content: 'Action cancelled', components: [] });
                }
            } catch (e) {
                console.log(e)
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            }
        },        
};        