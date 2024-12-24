import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nacl from 'tweetnacl';
import bs58 from 'bs58'
import { PublicKey } from '@solana/web3.js';
import { cache } from './cache';


import {
    AgentRuntime,
    elizaLogger,
    getEnvVariable,
    validateCharacterConfig,
} from "@elizaos/core";

import { REST, Routes } from "discord.js";
import { DirectClient } from ".";
// import { Buffer } from 'buffer'; // Add this import


export function createApiRouter(
    agents: Map<string, AgentRuntime>,
    directClient: DirectClient
) {
    const router = express.Router();

    router.use(cors());
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: true }));
    router.use(
        express.json({
            limit: getEnvVariable("EXPRESS_MAX_PAYLOAD") || "100kb",
        })
    );

    router.get("/", (req, res) => {
        res.send("Welcome, this is the REST API!");
    });

    router.get("/hello", (req, res) => {
        res.json({ message: "Hello Worlds!" });
    });

    router.get("/trigger2", (req, res) => {
        res.json({ message: "Hello Worlds!" });
    });

    router.get("/agents", (req, res) => {
        const agentsList = Array.from(agents.values()).map((agent) => ({
            id: agent.agentId,
            name: agent.character.name,
            clients: Object.keys(agent.clients),
        }));
        res.json({ agents: agentsList });
    });

    router.get("/agents/:agentId", (req, res) => {
        const agentId = req.params.agentId;
        const agent = agents.get(agentId);

        if (!agent) {
            res.status(404).json({ error: "Agent not found" });
            return;
        }

        res.json({
            id: agent.agentId,
            character: agent.character,
        });
    });

    router.post("/agents/:agentId/set", async (req, res) => {
        const agentId = req.params.agentId;
        console.log("agentId", agentId);
        let agent: AgentRuntime = agents.get(agentId);

        // update character
        if (agent) {
            // stop agent
            agent.stop();
            directClient.unregisterAgent(agent);
            // if it has a different name, the agentId will change
        }

        // load character from body
        const character = req.body;
        try {
            validateCharacterConfig(character);
        } catch (e) {
            elizaLogger.error(`Error parsing character: ${e}`);
            res.status(400).json({
                success: false,
                message: e.message,
            });
            return;
        }

        // start it up (and register it)
        agent = await directClient.startAgent(character);
        elizaLogger.log(`${character.name} started`);

        res.json({
            id: character.id,
            character: character,
        });
    });

    router.get("/agents/:agentId/channels", async (req, res) => {
        const agentId = req.params.agentId;
        const runtime = agents.get(agentId);

        if (!runtime) {
            res.status(404).json({ error: "Runtime not found" });
            return;
        }

        const API_TOKEN = runtime.getSetting("DISCORD_API_TOKEN") as string;
        const rest = new REST({ version: "10" }).setToken(API_TOKEN);

        try {
            const guilds = (await rest.get(Routes.userGuilds())) as Array<any>;

            res.json({
                id: runtime.agentId,
                guilds: guilds,
                serverCount: guilds.length,
            });
        } catch (error) {
            console.error("Error fetching guilds:", error);
            res.status(500).json({ error: "Failed to fetch guilds" });
        }
  });

  router.post("/claim-role", async (req, res) => {
      const { walletAddress, signature, message, discordUsername } = req.body;

      // Validate inputs
      if (!walletAddress || !signature || !message || !discordUsername) {
          return res.status(400).json({
              success: false,
              error: "Missing required fields"
          });
      }

      try {
          // Make sure nacl is properly imported
          if (!nacl || !nacl.sign || !nacl.sign.detached) {
              throw new Error('Nacl library not properly initialized');
          }

          // Decode the base64 message back to Uint8Array
          const decodedMessage = new Uint8Array(Buffer.from(message, 'base64'));

          // Decode the signature from base58
          const signedMessage = bs58.decode(signature);

          // Decode the wallet address from base58 to get the public key bytes
          const publicKeyBytes = bs58.decode(walletAddress);

          console.log('Verification details:', {
              messageLength: decodedMessage.length,
              signatureLength: signedMessage.length,
              publicKeyLength: publicKeyBytes.length,
              originalMessage: Buffer.from(decodedMessage).toString(),
          });

          const verified = nacl.sign.detached.verify(
              decodedMessage,      // the original message bytes
              signedMessage,       // the signature bytes
              publicKeyBytes       // the public key bytes
          );

          if (verified) {
              try {
                  // 1. Get Discord client/guild
                  const API_TOKEN = getEnvVariable("DISCORD_API_TOKEN");
                  const GUILD_ID = getEnvVariable("DISCORD_GUILD_ID");
                  const ROLE_ID = getEnvVariable("DISCORD_ROLE_ID");

                  const rest = new REST({ version: "10" }).setToken(API_TOKEN);

                  // 2. Find the user in the guild
                  const guild = await rest.get(Routes.guild(GUILD_ID));
                  const members = await rest.get(Routes.guildMembers(GUILD_ID));
                  const member = members.find(m => m.user.username === discordUsername);

                  if (!member) {
                      return res.status(404).json({
                          success: false,
                          error: "User not found in Discord server"
                      });
                  }

                  // 3. Assign the role
                  await rest.put(Routes.guildMemberRole(GUILD_ID, member.user.id, ROLE_ID));

                  // 4. Store the wallet-discord mapping using cache instead of fs
                  await cache.set(`wallet_${walletAddress}`, member.user.id);

                  return res.json({
                      success: true,
                      message: "Role assigned successfully"
                  });
              } catch (error) {
                  console.error('Error assigning role:', error);
                  return res.status(500).json({
                      success: false,
                      error: "Failed to assign role"
                  });
              }
          }



          console.log(`Signature verification result: ${verified}`);

          if (!verified) {
              return res.status(400).json({
                  success: false,
                  error: "Invalid signature"
              });
          }

          return res.json({
              success: true,
              message: "Signature verified successfully"
          });

      } catch (error) {
          console.error('Error verifying signature:', error);
          return res.status(400).json({
              success: false,
              error: "Signature verification failed: " + error.message
          });
      }
  });



    return router;
}
