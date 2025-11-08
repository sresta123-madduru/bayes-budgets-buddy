import { Expense, EXPENSE_CATEGORIES } from "@/types/expense";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check, TrendingUp, TrendingDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

interface ExpenseListProps {
  expenses: Expense[];
  onCategoryCorrect: (id: string, newCategory: string) => void;
}

export function ExpenseList({ expenses, onCategoryCorrect }: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (expenses.length === 0) {
    return (
      <Card className="p-8 text-center shadow-card">
        <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground">No expenses yet. Add your first expense to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <Card 
          key={expense.id} 
          className="p-4 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-foreground truncate">
                  {expense.description}
                </h3>
                {expense.userCorrected && (
                  <Badge variant="outline" className="text-xs border-accent text-accent">
                    <Check className="h-3 w-3 mr-1" />
                    Corrected
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                {editingId === expense.id ? (
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={expense.category}
                      onValueChange={(value) => {
                        onCategoryCorrect(expense.id, value);
                        setEditingId(null);
                      }}
                    >
                      <SelectTrigger className="w-[180px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-xs">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setEditingId(expense.id)}
                    >
                      {expense.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(expense.confidence * 100)}% confident
                    </span>
                  </>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                {expense.date.toLocaleDateString()} at {expense.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            <div className="text-right flex-shrink-0">
              <p className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ${expense.amount.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
