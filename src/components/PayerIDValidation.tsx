import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PayerIDValidationProps {
  onValidated: (payerId: string) => void;
}

const PayerIDValidation = ({ onValidated }: PayerIDValidationProps) => {
  const [payerId, setPayerId] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  const validatePayerId = async () => {
    if (!payerId.trim()) {
      setError("Please enter your Payer ID or TIN");
      return;
    }

    setIsValidating(true);
    setError("");
    
    // Validate format: either TIN (10+ digits) or Taxpayer ID (N-XXXXXXXX format)
    const tinPattern = /^\d{10,}$/;
    const taxPayerIdPattern = /^N-\d{8,}$/i;
    
    setTimeout(() => {
      if (tinPattern.test(payerId) || taxPayerIdPattern.test(payerId.toUpperCase())) {
        toast({
          title: "Tax ID Validated",
          description: "Format verified successfully",
        });
        onValidated(payerId.toUpperCase());
      } else {
        setError("Invalid format. Use either TIN (10 digits) or Taxpayer ID (N-XXXXXXXX)");
      }
      setIsValidating(false);
    }, 1000);
  };


  return (
    <Card className="shadow-strong border-border/50 backdrop-blur-sm bg-card/80">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-secondary flex items-center justify-center shadow-soft flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Verify Your Tax ID</h3>
              <p className="text-sm text-muted-foreground">
                Enter your TIN or Taxpayer ID from LIRS
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payerId">TIN or Taxpayer ID</Label>
              <Input
                id="payerId"
                placeholder="e.g., 1234567890 or N-16015654"
                value={payerId}
                onChange={(e) => {
                  setPayerId(e.target.value);
                  setError("");
                }}
                className={error ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">
                Enter your 10-digit TIN or Taxpayer ID (N-XXXXXXXX format)
              </p>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <Button 
              size="lg" 
              variant="secondary"
              onClick={validatePayerId}
              disabled={isValidating}
              className="w-full"
            >
              {isValidating ? "Validating..." : "Validate and Continue"}
            </Button>

            <div className="flex items-center justify-center gap-2 pt-2">
                <Badge variant="outline" className="text-xs">
                  Don't have a Tax ID?
                </Badge>
                <a 
                  href="https://etax.lirs.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline flex items-center gap-1"
                >
                  Create one here <ExternalLink className="w-3 h-3" />
                </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayerIDValidation;
