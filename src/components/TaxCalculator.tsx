import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TaxCalculatorProps {
  onCalculated: (taxAmount: number, income: number, breakdown: string[], taxType: string) => void;
}

const TaxCalculator = ({ onCalculated }: TaxCalculatorProps) => {
  const [income, setIncome] = useState("");
  const [taxType, setTaxType] = useState("paye");
  const [taxAmount, setTaxAmount] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [taxBreakdown, setTaxBreakdown] = useState<string[]>([]);

  const taxTypes = [
    { value: "paye", label: "PAYE (Pay As You Earn)", description: "Personal income tax for employees" },
    { value: "vat", label: "VAT (Value Added Tax)", description: "7.5% on goods and services" },
    { value: "cit", label: "CIT (Company Income Tax)", description: "30% on company profits" },
    { value: "withholding", label: "Withholding Tax", description: "Various rates on payments" },
  ];

  const calculatePAYE = (annualIncome: number) => {
    let tax = 0;
    const breakdown: string[] = [];
    
    if (annualIncome <= 300000) {
      tax = annualIncome * 0.07;
      breakdown.push(`₦${annualIncome.toLocaleString()} × 7% = ₦${tax.toLocaleString()}`);
    } else if (annualIncome <= 600000) {
      const firstBracket = 21000;
      const secondBracket = (annualIncome - 300000) * 0.11;
      tax = firstBracket + secondBracket;
      breakdown.push(`First ₦300,000 × 7% = ₦21,000`);
      breakdown.push(`Next ₦${(annualIncome - 300000).toLocaleString()} × 11% = ₦${Math.round(secondBracket).toLocaleString()}`);
    } else if (annualIncome <= 1100000) {
      tax = 54000 + (annualIncome - 600000) * 0.15;
      breakdown.push(`First ₦300,000 × 7% = ₦21,000`);
      breakdown.push(`Next ₦300,000 × 11% = ₦33,000`);
      breakdown.push(`Next ₦${(annualIncome - 600000).toLocaleString()} × 15% = ₦${Math.round((annualIncome - 600000) * 0.15).toLocaleString()}`);
    } else if (annualIncome <= 1600000) {
      tax = 129000 + (annualIncome - 1100000) * 0.19;
      breakdown.push(`First ₦1,100,000 = ₦129,000`);
      breakdown.push(`Next ₦${(annualIncome - 1100000).toLocaleString()} × 19% = ₦${Math.round((annualIncome - 1100000) * 0.19).toLocaleString()}`);
    } else if (annualIncome <= 3200000) {
      tax = 224000 + (annualIncome - 1600000) * 0.21;
      breakdown.push(`First ₦1,600,000 = ₦224,000`);
      breakdown.push(`Next ₦${(annualIncome - 1600000).toLocaleString()} × 21% = ₦${Math.round((annualIncome - 1600000) * 0.21).toLocaleString()}`);
    } else {
      tax = 560000 + (annualIncome - 3200000) * 0.24;
      breakdown.push(`First ₦3,200,000 = ₦560,000`);
      breakdown.push(`Above ₦3,200,000 × 24% = ₦${Math.round((annualIncome - 3200000) * 0.24).toLocaleString()}`);
    }
    
    return { tax: Math.round(tax), breakdown };
  };

  const calculateVAT = (amount: number) => {
    const tax = amount * 0.075;
    const breakdown = [`₦${amount.toLocaleString()} × 7.5% = ₦${Math.round(tax).toLocaleString()}`];
    return { tax: Math.round(tax), breakdown };
  };

  const calculateCIT = (profit: number) => {
    const tax = profit * 0.30;
    const breakdown = [`₦${profit.toLocaleString()} × 30% = ₦${Math.round(tax).toLocaleString()}`];
    return { tax: Math.round(tax), breakdown };
  };

  const calculateWithholding = (amount: number) => {
    const tax = amount * 0.10; // Simplified 10% rate
    const breakdown = [`₦${amount.toLocaleString()} × 10% (standard rate) = ₦${Math.round(tax).toLocaleString()}`];
    return { tax: Math.round(tax), breakdown };
  };

  const handleCalculate = () => {
    const incomeValue = parseFloat(income);
    
    if (isNaN(incomeValue) || incomeValue <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    
    setTimeout(() => {
      let result;
      
      switch (taxType) {
        case "paye":
          result = calculatePAYE(incomeValue);
          break;
        case "vat":
          result = calculateVAT(incomeValue);
          break;
        case "cit":
          result = calculateCIT(incomeValue);
          break;
        case "withholding":
          result = calculateWithholding(incomeValue);
          break;
        default:
          result = calculatePAYE(incomeValue);
      }
      
      setTaxAmount(result.tax);
      setTaxBreakdown(result.breakdown);
      onCalculated(result.tax, incomeValue, result.breakdown, taxType);
      setIsCalculating(false);
      
      toast({
        title: "Tax Calculated",
        description: `Your tax liability: ₦${result.tax.toLocaleString()}`,
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
          <CardTitle>Calculate Your Tax</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="taxType">Tax Type</Label>
            <Select value={taxType} onValueChange={setTaxType}>
              <SelectTrigger>
                <SelectValue placeholder="Select tax type" />
              </SelectTrigger>
              <SelectContent>
                {taxTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income">
              {taxType === "paye" ? "Annual Income" : 
               taxType === "cit" ? "Annual Profit" : "Amount"} (₦)
            </Label>
            <Input
              id="income"
              type="number"
              placeholder="e.g., 2,400,000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="text-lg"
            />
            <p className="text-xs text-muted-foreground">
              {taxType === "paye" ? "Enter your total annual income before tax" :
               taxType === "vat" ? "Enter the transaction amount" :
               taxType === "cit" ? "Enter your company's annual profit" :
               "Enter the payment amount subject to withholding"}
            </p>
          </div>

          {taxAmount !== null && (
            <div className="space-y-3">
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

              {taxBreakdown.length > 0 && (
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm font-medium mb-2">Calculation Breakdown:</p>
                  <ul className="space-y-1">
                    {taxBreakdown.map((line, index) => (
                      <li key={index} className="text-xs text-muted-foreground">• {line}</li>
                    ))}
                  </ul>
                </div>
              )}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
