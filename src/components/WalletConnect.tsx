import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WalletConnectProps {
  onConnected: (walletAddress: string) => void;
}

const WalletConnect = ({ onConnected }: WalletConnectProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    
    // Mock wallet connection - in production this would integrate with actual Web3 providers
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 42);
      onConnected(mockAddress);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected ${mockAddress.substring(0, 8)}...`,
      });
      setIsConnecting(false);
    }, 1500);
  };

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
            <Button 
              size="lg" 
              variant="hero"
              onClick={connectWallet}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Supports Phantom, Metamask, WalletConnect
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
