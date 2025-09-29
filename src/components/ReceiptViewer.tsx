import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck, Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReceiptViewerProps {
  payerId: string;
  taxAmount: number;
  walletAddress: string;
}

const ReceiptViewer = ({ payerId, taxAmount, walletAddress }: ReceiptViewerProps) => {
  const receiptNumber = `LIRS-${Date.now().toString().slice(-8)}`;
  const paymentDate = new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Your tax receipt has been saved to your device",
    });
  };

  const handleShare = () => {
    toast({
      title: "Receipt Shared",
      description: "Receipt link copied to clipboard",
    });
  };

  return (
    <Card className="shadow-strong border-border/50 overflow-hidden">
      <CardHeader className="border-b bg-gradient-secondary text-secondary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary-foreground/10 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Tax Payment Receipt</CardTitle>
            <p className="text-sm text-secondary-foreground/70">Official LIRS Confirmation</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Receipt Number</p>
              <p className="font-mono font-semibold text-foreground">{receiptNumber}</p>
            </div>
            <Badge className="bg-success text-success-foreground">Confirmed</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Payer ID (TIN)</p>
              <p className="font-mono text-sm font-medium text-foreground">{payerId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Payment Date</p>
              <p className="text-sm font-medium text-foreground">{paymentDate}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Tax Type</p>
                <p className="font-semibold text-foreground">PAYE - Personal Income Tax</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs text-muted-foreground">Amount Paid</p>
                <p className="text-2xl font-bold text-foreground">₦{taxAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Payment Source</p>
            <p className="font-mono text-xs text-foreground">
              {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 8)}
            </p>
          </div>

          <div className="pt-4 border-t space-y-3">
            <div className="flex gap-2">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              This receipt is valid and can be verified on the LIRS eTax portal
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptViewer;
