import { useState } from "react";
import { PlusCircle, TrendingUp, DollarSign, Calendar, Tag, BarChart3, Home, List, PieChart, Brain, ChevronLeft, Edit2, Trash2, CheckCircle } from "lucide-react";
import { NaiveBayesClassifier } from "@/lib/naiveBayes";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  predicted: string;
  date: string;
  corrected: boolean;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [classifier] = useState(() => {
    const nb = new NaiveBayesClassifier();
    nb.getPredefinedModel();
    return nb;
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingExpense, setEditingExpense] = useState<number | null>(null);

  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Utilities', 'Healthcare', 'Miscellaneous'];
  
  const categoryColors: Record<string, string> = {
    'Food & Dining': 'bg-orange-100 text-orange-800 border-orange-300',
    'Transportation': 'bg-blue-100 text-blue-800 border-blue-300',
    'Shopping': 'bg-purple-100 text-purple-800 border-purple-300',
    'Entertainment': 'bg-green-100 text-green-800 border-green-300',
    'Utilities': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Healthcare': 'bg-red-100 text-red-800 border-red-300',
    'Miscellaneous': 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const addExpense = () => {
    if (!description || !amount) return;

    const { category: predictedCategory } = classifier.classify(description);
    const finalCategory = selectedCategory || predictedCategory;

    const newExpense: Expense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category: finalCategory,
      predicted: predictedCategory,
      date: new Date().toISOString(),
      corrected: selectedCategory && selectedCategory !== predictedCategory
    };

    classifier.train([{ text: description, category: finalCategory }]);
    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
    setSelectedCategory('');
    setCurrentPage('expenses');
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateExpense = (id: number, newCategory: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setExpenses(expenses.map(e => 
        e.id === id ? { ...e, category: newCategory, corrected: true } : e
      ));
      classifier.train([{ text: expense.description, category: newCategory }]);
      setEditingExpense(null);
    }
  };

  const getCategoryTotal = (category: string) => {
    return expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryData = categories
    .map(cat => ({ category: cat, total: getCategoryTotal(cat), count: expenses.filter(e => e.category === cat).length }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const getMonthlyData = () => {
    const monthlyMap: Record<string, number> = {};
    expenses.forEach(exp => {
      const month = new Date(exp.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyMap[month] = (monthlyMap[month] || 0) + exp.amount;
    });
    return Object.entries(monthlyMap).map(([month, total]) => ({ month, total }));
  };

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-card shadow-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-foreground hidden sm:block">Smart Expense Tracker</span>
          </div>
          <div className="flex gap-1 sm:gap-2">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'add', icon: PlusCircle, label: 'Add' },
              { id: 'expenses', icon: List, label: 'Expenses' },
              { id: 'analytics', icon: PieChart, label: 'Analytics' },
              { id: 'model', icon: Brain, label: 'AI Model' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="hidden md:block text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  // Dashboard Page
  const DashboardPage = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg p-6 text-primary-foreground">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Total Spent</h3>
            <DollarSign className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold">${totalExpenses.toFixed(2)}</p>
          <p className="text-sm opacity-90 mt-2">Across all categories</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Transactions</h3>
            <List className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{expenses.length}</p>
          <p className="text-sm opacity-90 mt-2">Total expenses recorded</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Categories</h3>
            <Tag className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-4xl font-bold">{categoryData.length}</p>
          <p className="text-sm opacity-90 mt-2">Active categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Top Categories</h2>
          {categoryData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No expenses yet</p>
          ) : (
            <div className="space-y-4">
              {categoryData.slice(0, 5).map(({ category, total, count }) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${categoryColors[category]}`}>
                      {category}
                    </span>
                    <span className="text-sm text-muted-foreground">{count} items</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">${total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 5).map(expense => (
                <div key={expense.id} className="flex justify-between items-center border-b border-border pb-3">
                  <div>
                    <p className="font-medium text-foreground">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">${expense.amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded border ${categoryColors[expense.category]}`}>
                      {expense.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-accent/50 rounded-xl p-6 border border-border">
        <div className="flex items-start gap-4">
          <Brain className="w-10 h-10 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-bold text-foreground mb-2">AI-Powered Categorization</h3>
            <p className="text-muted-foreground">
              This tracker uses Naive Bayes machine learning to automatically categorize your expenses. 
              The more you use it and correct predictions, the smarter it becomes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Add Expense Page
  const AddExpensePage = () => (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setCurrentPage('dashboard')}
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Dashboard
      </button>

      <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
        <h1 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
          <PlusCircle className="w-8 h-8 text-primary" />
          Add New Expense
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Expense Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Uber ride to airport, Coffee at Starbucks"
              className="w-full px-4 py-3 border-2 border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-primary transition-all text-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Be descriptive - helps the AI learn better!</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Amount ($) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              className="w-full px-4 py-3 border-2 border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-primary transition-all text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Category (Optional)
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-primary transition-all text-foreground"
            >
              <option value="">🤖 Let AI predict automatically</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank for AI prediction, or manually select to train the model
            </p>
          </div>

          {description && (
            <div className="bg-accent rounded-lg p-4 border border-border">
              <p className="text-sm font-semibold text-foreground mb-1">AI Prediction:</p>
              <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border ${categoryColors[classifier.classify(description).category]}`}>
                {classifier.classify(description).category}
              </span>
            </div>
          )}

          <button
            onClick={addExpense}
            disabled={!description || !amount}
            className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors disabled:bg-muted disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-6 h-6" />
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );

  // Expenses List Page
  const ExpensesPage = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">All Expenses</h1>
        <button
          onClick={() => setCurrentPage('add')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add New
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="bg-card rounded-xl shadow-lg p-12 text-center border border-border">
          <List className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No expenses yet</h2>
          <p className="text-muted-foreground mb-6">Start tracking your expenses to see them here</p>
          <button
            onClick={() => setCurrentPage('add')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Add Your First Expense
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Category</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{expense.description}</p>
                      {expense.corrected && (
                        <p className="text-xs text-muted-foreground mt-1">
                          AI predicted: {expense.predicted}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingExpense === expense.id ? (
                        <select
                          defaultValue={expense.category}
                          onChange={(e) => updateExpense(expense.id, e.target.value)}
                          className="px-3 py-1 border border-input bg-background rounded-lg text-sm text-foreground"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${categoryColors[expense.category]}`}>
                          {expense.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setEditingExpense(editingExpense === expense.id ? null : expense.id)}
                          className="text-primary hover:text-primary/80 p-1"
                        >
                          {editingExpense === expense.id ? <CheckCircle className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-destructive hover:text-destructive/80 p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // Analytics Page
  const AnalyticsPage = () => {
    const monthlyData = getMonthlyData();
    
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-primary" />
              Spending by Category
            </h2>
            {categoryData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {categoryData.map(({ category, total, count }) => {
                  const percentage = ((total / totalExpenses) * 100).toFixed(1);
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${categoryColors[category]}`}>
                            {category}
                          </span>
                          <span className="text-sm text-muted-foreground">({count})</span>
                        </div>
                        <span className="font-bold text-foreground">${total.toFixed(2)}</span>
                      </div>
                      <div className="relative w-full bg-muted rounded-full h-3">
                        <div
                          className="absolute top-0 left-0 h-3 bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{percentage}% of total spending</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Average Expense by Category
            </h2>
            {categoryData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {categoryData.map(({ category, total, count }) => {
                  const average = total / count;
                  const maxAvg = Math.max(...categoryData.map(c => c.total / c.count));
                  const barWidth = ((average / maxAvg) * 100).toFixed(1);
                  
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${categoryColors[category]}`}>
                          {category}
                        </span>
                        <span className="font-bold text-foreground">${average.toFixed(2)}</span>
                      </div>
                      <div className="relative w-full bg-muted rounded-full h-3">
                        <div
                          className="absolute top-0 left-0 h-3 bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {monthlyData.length > 0 && (
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Monthly Spending Trend
            </h2>
            <div className="space-y-3">
              {monthlyData.map(({ month, total }) => {
                const maxTotal = Math.max(...monthlyData.map(m => m.total));
                const barWidth = ((total / maxTotal) * 100).toFixed(1);
                
                return (
                  <div key={month}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-foreground">{month}</span>
                      <span className="font-bold text-foreground">${total.toFixed(2)}</span>
                    </div>
                    <div className="relative w-full bg-muted rounded-full h-4">
                      <div
                        className="absolute top-0 left-0 h-4 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // AI Model Page
  const ModelPage = () => {
    const correctedCount = expenses.filter(e => e.corrected).length;
    const accuracyRate = expenses.length > 0 
      ? (((expenses.length - correctedCount) / expenses.length) * 100).toFixed(1)
      : '0';

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          AI Model Information
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-primary rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Model Accuracy</h3>
            <p className="text-5xl font-bold">{accuracyRate}%</p>
            <p className="text-sm opacity-90 mt-2">Based on {expenses.length} predictions</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Training Data</h3>
            <p className="text-5xl font-bold">{expenses.length + 24}</p>
            <p className="text-sm opacity-90 mt-2">Total training examples</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Categories Learned</h3>
            <p className="text-5xl font-bold">{categories.length}</p>
            <p className="text-sm opacity-90 mt-2">Unique categories</p>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">How Naive Bayes Works</h2>
          <div className="space-y-4 text-muted-foreground">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Text Tokenization</h3>
                <p className="text-sm">The algorithm breaks down expense descriptions into individual words (tokens), removing short words and punctuation.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Probability Calculation</h3>
                <p className="text-sm">It calculates the probability of each word appearing in different categories based on historical data.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Classification</h3>
                <p className="text-sm">For new expenses, it combines word probabilities to determine the most likely category.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Continuous Learning</h3>
                <p className="text-sm">Each time you add or correct an expense, the model updates its knowledge and improves accuracy.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Model Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-foreground">Total Expenses</span>
                <span className="font-bold text-foreground">{expenses.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-foreground">Corrected Predictions</span>
                <span className="font-bold text-foreground">{correctedCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-foreground">Correct Predictions</span>
                <span className="font-bold text-foreground">{expenses.length - correctedCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-accent rounded-lg border border-border">
                <span className="text-foreground font-semibold">Accuracy Rate</span>
                <span className="font-bold text-primary text-xl">{accuracyRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Category Performance</h2>
            {categoryData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data available yet</p>
            ) : (
              <div className="space-y-3">
                {categoryData.map(({ category, count }) => (
                  <div key={category} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${categoryColors[category]}`}>
                      {category}
                    </span>
                    <span className="text-foreground">{count} examples</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-accent/50 rounded-xl p-6 border border-border">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Tips for Better Accuracy
          </h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Use descriptive keywords in your expense descriptions (e.g., "coffee", "gas", "doctor")</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Correct wrong predictions immediately to improve future accuracy</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Be consistent with your descriptions for similar expenses</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>The more data you add, the smarter the model becomes</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'add' && <AddExpensePage />}
        {currentPage === 'expenses' && <ExpensesPage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'model' && <ModelPage />}
      </div>
    </div>
  );
};

export default Index;
