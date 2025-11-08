import { Expense, ExpenseCategory } from "@/types/expense";
import { Card } from "./ui/card";
import { useMemo } from "react";

interface CategoryStatsProps {
  expenses: Expense[];
}

export function CategoryStats({ expenses }: CategoryStatsProps) {
  const stats = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category as ExpenseCategory;
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  if (expenses.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 shadow-card">
      <h2 className="text-xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
        Spending Overview
      </h2>
      
      <div className="mb-6 p-4 rounded-lg bg-gradient-primary">
        <p className="text-sm text-primary-foreground/80 mb-1">Total Spending</p>
        <p className="text-3xl font-bold text-primary-foreground">
          ${totalSpent.toFixed(2)}
        </p>
      </div>

      <div className="space-y-4">
        {stats.map(({ category, amount, percentage }) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{category}</span>
              <span className="text-muted-foreground">${amount.toFixed(2)}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {percentage.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
