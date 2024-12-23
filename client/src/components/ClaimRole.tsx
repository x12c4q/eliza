import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { Button } from "./ui/button";
import { Buffer } from 'buffer'; // Add this import

// Add this line at the top of the file after imports
window.Buffer = window.Buffer || Buffer;

export function ClaimRole() {
  const { publicKey, signMessage } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClaimRole = async () => {
    if (!publicKey || !signMessage) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Create message to sign
      const message = new TextEncoder().encode(
        `Verify wallet ownership for Discord role claim\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`
      );

      // Request signature
      const signature = await signMessage(message);

      // Send to backend
      const response = await fetch("/api/claim-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          signature: bs58.encode(signature),
          message: Buffer.from(message).toString("base64"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim role");
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error claiming role:", error);
      setError(error instanceof Error ? error.message : "Failed to claim role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={handleClaimRole}
        disabled={!publicKey || isLoading}
        className="w-full max-w-xs"
      >
        {isLoading ? "Claiming..." : "Claim Discord Role"}
      </Button>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {success && (
        <p className="text-green-500 text-sm">
          Role claimed successfully! Please check your Discord.
        </p>
      )}
    </div>
  );
}
