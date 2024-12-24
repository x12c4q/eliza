import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();


const API_TOKEN = "dfgg";
const GUILD_ID = "3434";
const ROLE_ID = "343";




async function testDiscordMembers() {
    try {
        // Validate environment variables


        // Initialize Discord client with proper intents
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMembers,
            ]
        });

        // Initialize REST client
        const rest = new REST({ version: "10" }).setToken(API_TOKEN);

        // Login to Discord
        await client.login(API_TOKEN);

        // Wait for client to be ready
        await new Promise((resolve) => client.once('ready', resolve));

        // Fetch guild
        const guild = await client.guilds.fetch(GUILD_ID);
        console.log('Guild:', guild.name);

        // Fetch all members with presence data
        const members = await guild.members.fetch({ withPresences: true });

        // Convert members to array and log
        const membersArray = Array.from(members.values());
        console.log('Total Members:', membersArray.length);
        console.log('Members:', JSON.stringify(membersArray.map(m => ({
            id: m.id,
            username: m.user.username,
            presence: m.presence?.status || 'offline'
        })), null, 2));

        // Optional: Test finding a specific member
        const testUsername = 'some_username';
        const member = membersArray.find(m => m.user.username === testUsername);
        console.log('Found member:', member);

        // Cleanup
        client.destroy();

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Environment validation failed:', error.errors);
        } else {
            console.error('Error:', error);
        }
    }
}

// Run the test
testDiscordMembers();
