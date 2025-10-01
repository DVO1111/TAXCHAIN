import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Coins, FileSignature } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSignMessage, useAccount } from "wagmi";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taxAmount: number;
  taxBreakdown: string[];
  taxType: string;
  onPaymentComplete: () => void;
}

const PaymentModal = ({ open, onOpenChange, taxAmount, taxBreakdown, taxType, onPaymentComplete }: PaymentModalProps) => {
  const taxTypeLabels: Record<string, string> = {
    paye: "PAYE (Pay As You Earn)",
    vat: "VAT (Value Added Tax)",
    cit: "CIT (Company Income Tax)",
    withholding: "Withholding Tax"
  };
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [isSigning, setIsSigning] = useState(false);
  const [signatureVerified, setSignatureVerified] = useState(false);

  // Solana wallet hooks
  const { publicKey, signMessage: solanaSignMessage } = useWallet();
  
  // Ethereum wallet hooks
  const { address: ethAddress } = useAccount();
  const { signMessageAsync: ethSignMessage } = useSignMessage();

  const cryptoOptions = [
    { symbol: "USDT", name: "Tether", rate: 1 },
    { symbol: "USDC", name: "USD Coin", rate: 1 },
    { symbol: "ETH", name: "Ethereum", rate: 0.00041 },
    { symbol: "SOL", name: "Solana", rate: 0.012 },
  ];

  const selectedOption = cryptoOptions.find(c => c.symbol === selectedCrypto);
  const cryptoAmount = selectedOption ? (taxAmount / 1600 * selectedOption.rate).toFixed(6) : "0";

  const handleSignMessage = async () => {
    if (signatureVerified) return;

    setIsSigning(true);
    try {
      const message = `I authorize the payment of ₦${taxAmount.toLocaleString()} for ${taxTypeLabels[taxType]} tax.\n\nTimestamp: ${new Date().toISOString()}`;

      if (publicKey && solanaSignMessage) {
        // Solana wallet signature
        const encodedMessage = new TextEncoder().encode(message);
        const signature = await solanaSignMessage(encodedMessage);
        console.log('Solana signature:', signature);
      } else if (ethAddress && ethSignMessage) {
        // Ethereum wallet signature
        const signature = await ethSignMessage({ 
          message,
          account: ethAddress 
        });
        console.log('Ethereum signature:', signature);
      }

      setSignatureVerified(true);
      toast({
        title: "Message Signed",
        description: "Payment authorization confirmed",
      });
    } catch (error) {
      console.error('Signature error:', error);
      toast({
        title: "Signature Failed",
        description: "Please sign the message to authorize payment",
        variant: "destructive"
      });
    } finally {
      setIsSigning(false);
    }
  };

  const handlePayment = async () => {
    if (!signatureVerified) {
      toast({
        title: "Signature Required",
        description: "Please sign the message before payment",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Mock payment flow with off-ramp and Remita settlement
    setTimeout(() => {
      toast({
        title: "Processing Payment",
        description: "Converting crypto to NGN via Paj Cash...",
      });
    }, 500);

    setTimeout(() => {
      toast({
        title: "Submitting to LIRS",
        description: "Sending payment to Remita portal...",
      });
    }, 2000);

    setTimeout(() => {
      setIsProcessing(false);
      setSignatureVerified(false);
      onPaymentComplete();
      toast({
        title: "Payment Successful!",
        description: "Your tax payment has been confirmed by LIRS",
      });
    }, 3500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            Pay with Crypto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Tax Type</p>
              <Badge variant="secondary">{taxTypeLabels[taxType] || taxType}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Tax Amount</p>
              <p className="text-3xl font-bold text-foreground">₦{taxAmount.toLocaleString()}</p>
            </div>
          </div>

          {taxBreakdown.length > 0 && (
            <div className="p-4 rounded-lg bg-card border">
              <p className="text-sm font-medium mb-2">Tax Calculation:</p>
              <ul className="space-y-1">
                {taxBreakdown.map((line, index) => (
                  <li key={index} className="text-xs text-muted-foreground">• {line}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Cryptocurrency</Label>
            <div className="grid grid-cols-2 gap-2">
              {cryptoOptions.map((crypto) => (
                <button
                  key={crypto.symbol}
                  onClick={() => setSelectedCrypto(crypto.symbol)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedCrypto === crypto.symbol
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <p className="font-semibold text-foreground">{crypto.symbol}</p>
                  <p className="text-xs text-muted-foreground">{crypto.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-accent border border-accent/20">
            <div className="flex justify-between items-center">
              <p className="text-sm text-accent-foreground/80 font-medium">You'll Pay</p>
              <div className="text-right">
                <p className="text-2xl font-bold text-accent-foreground">
                  {cryptoAmount} {selectedCrypto}
                </p>
                <p className="text-xs text-accent-foreground/60">
                  ≈ ₦{taxAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Instant conversion via Paj Cash</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Auto-settlement to LIRS via Remita</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Official receipt generated instantly</span>
            </div>
          </div>

          {!signatureVerified && (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={handleSignMessage}
              disabled={isSigning}
              className="w-full"
            >
              {isSigning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Waiting for Signature...
                </>
              ) : (
                <>
                  <FileSignature className="w-4 h-4 mr-2" />
                  Sign to Authorize Payment
                </>
              )}
            </Button>
          )}

          {signatureVerified && (
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Payment Authorized</span>
              </div>
            </div>
          )}

          <Button 
            size="lg" 
            variant="success"
            onClick={handlePayment}
            disabled={isProcessing || !signatureVerified}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing Payment...
              </>
            ) : (
              "Complete Payment"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

export default PaymentModal;
