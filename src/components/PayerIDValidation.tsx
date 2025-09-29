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
      setError("Please enter your Payer ID");
      return;
    }

    setIsValidating(true);
    setError("");
    
    // Mock validation - in production this would call LIRS API
    setTimeout(() => {
      if (payerId.length >= 10) {
        onValidated(payerId);
        toast({
          title: "Payer ID Validated",
          description: "Your Payer ID has been successfully verified",
        });
      } else {
        setError("Invalid Payer ID format. Please check and try again.");
      }
      setIsValidating(false);
    }, 1500);
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
              <h3 className="text-xl font-bold text-foreground">Verify Your Payer ID</h3>
              <p className="text-sm text-muted-foreground">
                Enter your TIN (Taxpayer Identification Number) from LIRS
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payerId">Payer ID (TIN)</Label>
              <Input
                id="payerId"
                placeholder="Enter your 10-digit Payer ID"
                value={payerId}
                onChange={(e) => {
                  setPayerId(e.target.value);
                  setError("");
                }}
                className={error ? "border-destructive" : ""}
              />
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
              {isValidating ? "Validating..." : "Validate Payer ID"}
            </Button>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Badge variant="outline" className="text-xs">
                Don't have a Payer ID?
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
