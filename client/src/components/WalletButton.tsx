import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardHeader } from "./ui/card";

export function WalletButton() {
  const { publicKey } = useWallet();

  return (
    <Card className="w-full max-w-md mb-4">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Connect Wallet</h2>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />

        {publicKey && (
          <div className="text-sm text-muted-foreground">
            Connected: {publicKey.toBase58()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
