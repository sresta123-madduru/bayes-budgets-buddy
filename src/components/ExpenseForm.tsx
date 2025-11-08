import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { PlusCircle } from "lucide-react";

interface ExpenseFormProps {
  onAddExpense: (description: string, amount: number) => void;
}

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && amount) {
      onAddExpense(description.trim(), parseFloat(amount));
      setDescription("");
      setAmount("");
    }
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-card-hover transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Input
            id="description"
            type="text"
            placeholder="e.g., Coffee at Starbucks"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="transition-all duration-200 focus:shadow-md"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="transition-all duration-200 focus:shadow-md"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </form>
    </Card>
  );
}
