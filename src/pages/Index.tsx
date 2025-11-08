import { useState, useEffect } from "react";
import { Expense } from "@/types/expense";
import { NaiveBayesClassifier } from "@/lib/naiveBayes";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { CategoryStats } from "@/components/CategoryStats";
import { toast } from "sonner";
import { Sparkles, TrendingUp } from "lucide-react";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [classifier] = useState(() => {
    const clf = new NaiveBayesClassifier();
    clf.getPredefinedModel();
    return clf;
  });

  const handleAddExpense = (description: string, amount: number) => {
    const { category, probability } = classifier.classify(description);
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      category,
      confidence: probability,
      date: new Date(),
      userCorrected: false,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    
    toast.success("Expense added!", {
      description: `Categorized as "${category}" with ${Math.round(probability * 100)}% confidence`,
    });
  };

  const handleCategoryCorrect = (id: string, newCategory: string) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? { ...expense, category: newCategory, userCorrected: true }
          : expense
      )
    );

    // Retrain the classifier with the corrected data
    const correctedExpense = expenses.find((e) => e.id === id);
    if (correctedExpense) {
      classifier.train([
        { text: correctedExpense.description, category: newCategory },
      ]);
      
      toast.success("Category updated!", {
        description: "The AI model has learned from your correction",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Smart Expense Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered expense categorization with Naive Bayes
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form and Stats */}
          <div className="lg:col-span-1 space-y-6">
            <ExpenseForm onAddExpense={handleAddExpense} />
            <CategoryStats expenses={expenses} />
          </div>

          {/* Right Column - Expense List */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Expenses
              </h2>
              {expenses.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
                </p>
              )}
            </div>
            <ExpenseList 
              expenses={expenses} 
              onCategoryCorrect={handleCategoryCorrect}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
