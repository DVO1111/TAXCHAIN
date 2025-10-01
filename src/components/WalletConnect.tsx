import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Loader2, Coins } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAccount, useBalance } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface WalletConnectProps {
  onConnected: (walletAddress: string) => void;
}

const WalletConnect = ({ onConnected }: WalletConnectProps) => {
  const [hasNotified, setHasNotified] = useState(false);
  const [solanaBalance, setSolanaBalance] = useState<number | null>(null);
  const [connectionTime, setConnectionTime] = useState<number | null>(null);
  
  // Solana wallet hooks
  const { publicKey, connected: solanaConnected, connecting: solanaConnecting, disconnect: solanaDisconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { connection } = useConnection();
  
  // Ethereum wallet hooks
  const { address: ethAddress, isConnected: ethConnected } = useAccount();
  const { data: ethBalanceData } = useBalance({
    address: ethAddress,
  });

  // Handle wallet connection - opens unified modal
  const handleConnectWallet = async () => {
    console.log("Opening wallet selection modal");
    setHasNotified(false);
    setVisible(true);
  };

  // Fetch Solana balance
  useEffect(() => {
    if (solanaConnected && publicKey) {
      connection.getBalance(publicKey).then((balance) => {
        setSolanaBalance(balance / LAMPORTS_PER_SOL);
      });
    }
  }, [solanaConnected, publicKey, connection]);

  // Monitor Solana connection
  useEffect(() => {
    if (solanaConnected && publicKey && !hasNotified) {
      console.log("Solana wallet connected:", publicKey.toBase58());
      const address = publicKey.toBase58();
      setHasNotified(true);
      onConnected(address);
      toast({
        title: "Wallet Connected",
        description: `Connected: ${address.substring(0, 8)}...`,
      });
    }
  }, [solanaConnected, publicKey, hasNotified, onConnected]);

  // Monitor Ethereum connection
  useEffect(() => {
    if (ethConnected && ethAddress && !hasNotified) {
      console.log("Ethereum wallet connected:", ethAddress);
      setHasNotified(true);
      setConnectionTime(Date.now());
      onConnected(ethAddress);
      toast({
        title: "Wallet Connected",
        description: `Connected: ${ethAddress.substring(0, 8)}...`,
      });
    }
  }, [ethConnected, ethAddress, hasNotified, onConnected]);

  // Auto-disconnect after 5 minutes
  useEffect(() => {
    if (!connectionTime) return;

    const disconnectTimer = setTimeout(() => {
      if (solanaConnected) {
        solanaDisconnect();
      }
      // Note: Ethereum disconnect is handled by RainbowKit
      setConnectionTime(null);
      setHasNotified(false);
      toast({
        title: "Session Expired",
        description: "Please reconnect your wallet to continue",
        variant: "destructive"
      });
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearTimeout(disconnectTimer);
  }, [connectionTime, solanaConnected, solanaDisconnect]);

  const isConnected = solanaConnected || ethConnected;
  const walletAddress = publicKey?.toBase58() || ethAddress;
  const balance = solanaConnected && solanaBalance !== null 
    ? `${solanaBalance.toFixed(4)} SOL` 
    : ethConnected && ethBalanceData 
    ? `${parseFloat(ethBalanceData.formatted).toFixed(4)} ${ethBalanceData.symbol}`
    : null;

  return (
    <Card className="shadow-strong border-border/50 backdrop-blur-sm bg-card/80">
      <CardContent className="pt-6">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center shadow-glow">
              <Wallet className="w-8 h-8 text-accent-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Connect your crypto wallet to start paying taxes in seconds
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {!isConnected ? (
              <>
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button 
                      size="lg" 
                      variant="hero"
                      onClick={() => {
                        handleConnectWallet();
                        openConnectModal();
                      }}
                      className="w-full"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Wallet
                    </Button>
                  )}
                </ConnectButton.Custom>
                
                {solanaConnecting && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Waiting for wallet approval...</span>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Supports Phantom, Solflare, MetaMask, WalletConnect and more
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-secondary border border-secondary/20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-foreground/80">Wallet Address</span>
                      <Badge variant="outline" className="text-xs">Connected</Badge>
                    </div>
                    <p className="text-sm font-mono text-secondary-foreground break-all">
                      {walletAddress}
                    </p>
                  </div>
                </div>

                {balance && (
                  <div className="p-4 rounded-lg bg-gradient-accent border border-accent/20">
                    <div className="flex items-center gap-3">
                      <Coins className="w-5 h-5 text-accent-foreground" />
                      <div>
                        <p className="text-xs text-accent-foreground/70">Balance</p>
                        <p className="text-lg font-bold text-accent-foreground">{balance}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
