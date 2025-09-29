import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TaxCalculatorProps {
  onCalculated: (taxAmount: number, income: number) => void;
}

const TaxCalculator = ({ onCalculated }: TaxCalculatorProps) => {
  const [income, setIncome] = useState("");
  const [taxAmount, setTaxAmount] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Nigerian PAYE tax brackets (simplified for MVP)
  const calculatePAYE = (annualIncome: number) => {
    let tax = 0;
    
    if (annualIncome <= 300000) {
      tax = annualIncome * 0.07;
    } else if (annualIncome <= 600000) {
      tax = 21000 + (annualIncome - 300000) * 0.11;
    } else if (annualIncome <= 1100000) {
      tax = 54000 + (annualIncome - 600000) * 0.15;
    } else if (annualIncome <= 1600000) {
      tax = 129000 + (annualIncome - 1100000) * 0.19;
    } else if (annualIncome <= 3200000) {
      tax = 224000 + (annualIncome - 1600000) * 0.21;
    } else {
      tax = 560000 + (annualIncome - 3200000) * 0.24;
    }
    
    return Math.round(tax);
  };

  const handleCalculate = () => {
    const incomeValue = parseFloat(income);
    
    if (isNaN(incomeValue) || incomeValue <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid income amount",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    
    setTimeout(() => {
      const calculatedTax = calculatePAYE(incomeValue);
      setTaxAmount(calculatedTax);
      onCalculated(calculatedTax, incomeValue);
      setIsCalculating(false);
      
      toast({
        title: "Tax Calculated",
        description: `Your tax liability: ₦${calculatedTax.toLocaleString()}`,
      });
    }, 1000);
  };

  return (
    <Card className="shadow-strong border-border/50">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-accent flex items-center justify-center">
            <Calculator className="w-5 h-5 text-accent-foreground" />
          </div>
          <CardTitle>Calculate Your PAYE Tax</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="income">Annual Income (₦)</Label>
            <Input
              id="income"
              type="number"
              placeholder="e.g., 2,400,000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Enter your total annual income before tax
            </p>
          </div>

          {taxAmount !== null && (
            <div className="p-4 rounded-lg bg-gradient-secondary border border-secondary/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-secondary-foreground/80 font-medium">Your Tax Liability</p>
                  <p className="text-3xl font-bold text-secondary-foreground">
                    ₦{taxAmount.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-secondary-foreground/60" />
              </div>
            </div>
          )}

          <Button 
            size="lg" 
            variant="accent"
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full"
          >
            {isCalculating ? "Calculating..." : "Calculate Tax"}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">PAYE Tax Brackets (Annual):</p>
            <ul className="space-y-0.5 pl-4">
              <li>• First ₦300,000: 7%</li>
              <li>• Next ₦300,000: 11%</li>
              <li>• Next ₦500,000: 15%</li>
              <li>• Next ₦500,000: 19%</li>
              <li>• Next ₦1,600,000: 21%</li>
              <li>• Above ₦3,200,000: 24%</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
