import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; // Add this import
import { Buffer } from 'buffer'; // Add this import


export function ClaimRole() {
  const { publicKey, signMessage } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [discordUsername, setDiscordUsername] = useState(""); // Add this state

  const handleClaimRole = async () => {
    if (!publicKey || !signMessage) {
      setError("Please connect your wallet first");
      return;
    }

    if (!discordUsername) {
      setError("Please enter your Discord username");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create message to sign
      const messageText = `Verify Discord username: ${discordUsername}\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`;
      const message = new TextEncoder().encode(messageText);

      // Request signature
      const signature = await signMessage(message);

      // Send to backend
      const response = await fetch("https://aec8ef01eaaa.ngrok.app/claim-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          signature: bs58.encode(signature),
          message: Buffer.from(message).toString('base64'),
          discordUsername: discordUsername
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify");
      }

      setSuccess(true);
      alert("Role successfully assigned! You can now chat with the bot.");
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to verify");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Enter Discord username"
        value={discordUsername}
        onChange={(e) => setDiscordUsername(e.target.value)}
      />
      <Button
        onClick={handleClaimRole}
        disabled={!publicKey || isLoading || !discordUsername}
      >
        {isLoading ? "Verifying..." : "Verify Discord Username"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Successfully verified!</p>}
    </div>
  );
}
