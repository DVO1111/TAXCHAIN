import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface WalletConnectProps {
  onConnected: (walletAddress: string) => void;
}

const WalletConnect = ({ onConnected }: WalletConnectProps) => {
  const [selectedChain, setSelectedChain] = useState<"solana" | "ethereum" | null>(null);
  const [hasNotified, setHasNotified] = useState(false);
  
  // Solana wallet hooks
  const { publicKey, connected: solanaConnected, connecting: solanaConnecting } = useWallet();
  const { setVisible } = useWalletModal();
  
  // Ethereum wallet hooks
  const { address: ethAddress, isConnected: ethConnected } = useAccount();

  // Handle Solana wallet connection
  const handleSolanaConnect = () => {
    console.log("Opening Solana wallet selection modal");
    setSelectedChain("solana");
    setHasNotified(false);
    setVisible(true);
  };

  // Handle Ethereum wallet connection
  const handleEthereumConnect = () => {
    console.log("Opening Ethereum wallet modal");
    setSelectedChain("ethereum");
    setHasNotified(false);
  };

  // Monitor Solana connection with useEffect
  useEffect(() => {
    if (solanaConnected && publicKey && selectedChain === "solana" && !hasNotified) {
      console.log("Solana wallet connected:", publicKey.toBase58());
      const address = publicKey.toBase58();
      setHasNotified(true);
      onConnected(address);
      toast({
        title: "Solana Wallet Connected",
        description: `Connected: ${address.substring(0, 8)}...`,
      });
    }
  }, [solanaConnected, publicKey, selectedChain, hasNotified, onConnected]);

  // Monitor Ethereum connection with useEffect
  useEffect(() => {
    if (ethConnected && ethAddress && selectedChain === "ethereum" && !hasNotified) {
      console.log("Ethereum wallet connected:", ethAddress);
      setHasNotified(true);
      onConnected(ethAddress);
      toast({
        title: "Ethereum Wallet Connected",
        description: `Connected: ${ethAddress.substring(0, 8)}...`,
      });
    }
  }, [ethConnected, ethAddress, selectedChain, hasNotified, onConnected]);

  // Log connection state changes
  useEffect(() => {
    console.log("Solana state:", { solanaConnected, solanaConnecting, publicKey: publicKey?.toBase58() });
  }, [solanaConnected, solanaConnecting, publicKey]);

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

          <div className="flex flex-col gap-3">
            {!selectedChain && (
              <>
                <Button 
                  size="lg" 
                  variant="hero"
                  onClick={handleSolanaConnect}
                  className="w-full"
                >
                  Connect Solana Wallet
                </Button>
                
                <div className="w-full">
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => {
                          handleEthereumConnect();
                          openConnectModal();
                        }}
                        className="w-full"
                      >
                        Connect Ethereum Wallet
                      </Button>
                    )}
                  </ConnectButton.Custom>
                </div>
              </>
            )}
            
            {selectedChain === "solana" && (solanaConnecting || !solanaConnected) && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Waiting for wallet approval...</span>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Supports Phantom, Solflare, Metamask, WalletConnect
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
