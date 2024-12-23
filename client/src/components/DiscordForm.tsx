import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useWallet } from "@solana/wallet-adapter-react";

export function DiscordForm() {
  const [discordId, setDiscordId] = useState("");
  const { publicKey } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) return;

    try {
      // Call your API to assign the Discord role
      const response = await fetch("/api/claim-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          discordId,
        }),
      });

      if (response.ok) {
        alert("Role claimed successfully!");
      }
    } catch (error) {
      console.error("Failed to claim role:", error);
      alert("Failed to claim role. Please try again.");
    }
  };

  if (!publicKey) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-xl font-semibold">Claim Discord Role</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="Enter Discord ID"
            value={discordId}
            onChange={(e) => setDiscordId(e.target.value)}
          />
          <Button type="submit">Claim Role</Button>
        </form>
      </CardContent>
    </Card>
  );
}
