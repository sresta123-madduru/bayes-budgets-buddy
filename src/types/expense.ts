export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  confidence: number;
  date: Date;
  userCorrected?: boolean;
}

export type ExpenseCategory = 
  | "Food & Dining"
  | "Transportation"
  | "Shopping"
  | "Entertainment"
  | "Utilities"
  | "Healthcare"
  | "Miscellaneous";

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Miscellaneous",
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  "Food & Dining": "from-orange-500 to-red-500",
  "Transportation": "from-blue-500 to-cyan-500",
  "Shopping": "from-purple-500 to-pink-500",
  "Entertainment": "from-green-500 to-emerald-500",
  "Utilities": "from-yellow-500 to-orange-500",
  "Healthcare": "from-red-500 to-pink-500",
  "Miscellaneous": "from-gray-500 to-slate-500",
};
