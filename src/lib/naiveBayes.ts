export interface TrainingData {
  text: string;
  category: string;
}

export class NaiveBayesClassifier {
  private categoryWordCounts: Map<string, Map<string, number>> = new Map();
  private categoryCounts: Map<string, number> = new Map();
  private vocabulary: Set<string> = new Set();
  private totalDocuments = 0;

  constructor(initialTrainingData?: TrainingData[]) {
    if (initialTrainingData) {
      this.train(initialTrainingData);
    }
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  train(data: TrainingData[]): void {
    data.forEach(({ text, category }) => {
      const words = this.tokenize(text);
      
      if (!this.categoryWordCounts.has(category)) {
        this.categoryWordCounts.set(category, new Map());
        this.categoryCounts.set(category, 0);
      }

      this.categoryCounts.set(category, (this.categoryCounts.get(category) || 0) + 1);
      const wordCounts = this.categoryWordCounts.get(category)!;

      words.forEach(word => {
        this.vocabulary.add(word);
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      });

      this.totalDocuments++;
    });
  }

  classify(text: string): { category: string; probability: number } {
    const words = this.tokenize(text);
    const scores = new Map<string, number>();

    for (const [category, count] of this.categoryCounts.entries()) {
      const prior = Math.log(count / this.totalDocuments);
      const wordCounts = this.categoryWordCounts.get(category)!;
      const totalWordsInCategory = Array.from(wordCounts.values()).reduce((a, b) => a + b, 0);

      let logLikelihood = 0;
      for (const word of words) {
        const wordCount = wordCounts.get(word) || 0;
        // Laplace smoothing
        const probability = (wordCount + 1) / (totalWordsInCategory + this.vocabulary.size);
        logLikelihood += Math.log(probability);
      }

      scores.set(category, prior + logLikelihood);
    }

    let maxScore = -Infinity;
    let bestCategory = '';

    for (const [category, score] of scores.entries()) {
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category;
      }
    }

    // Convert log probability to actual probability (approximate)
    const totalScore = Array.from(scores.values()).reduce((sum, score) => sum + Math.exp(score), 0);
    const probability = Math.exp(maxScore) / totalScore;

    return { category: bestCategory, probability };
  }

  getPredefinedModel(): void {
    const trainingData: TrainingData[] = [
      // Food & Dining
      { text: "coffee starbucks latte cappuccino espresso", category: "Food & Dining" },
      { text: "restaurant dinner lunch breakfast meal food", category: "Food & Dining" },
      { text: "grocery supermarket walmart target trader joes whole foods", category: "Food & Dining" },
      { text: "pizza burger sandwich sushi pasta", category: "Food & Dining" },
      { text: "takeout delivery uber eats doordash grubhub", category: "Food & Dining" },
      
      // Transportation
      { text: "uber lyft taxi ride car transport", category: "Transportation" },
      { text: "gas fuel petrol station chevron shell", category: "Transportation" },
      { text: "parking meter garage lot", category: "Transportation" },
      { text: "metro subway bus train transit", category: "Transportation" },
      { text: "flight airline airport ticket travel", category: "Transportation" },
      
      // Shopping
      { text: "amazon online shopping purchase buy", category: "Shopping" },
      { text: "clothes clothing fashion apparel shoes", category: "Shopping" },
      { text: "electronics gadget phone laptop computer", category: "Shopping" },
      { text: "home depot lowes hardware tools", category: "Shopping" },
      { text: "furniture ikea decor household", category: "Shopping" },
      
      // Entertainment
      { text: "netflix spotify hulu disney streaming subscription", category: "Entertainment" },
      { text: "movie cinema theater film tickets", category: "Entertainment" },
      { text: "concert show event tickets live performance", category: "Entertainment" },
      { text: "games gaming playstation xbox nintendo", category: "Entertainment" },
      { text: "book bookstore kindle audible reading", category: "Entertainment" },
      
      // Utilities
      { text: "electric electricity power bill utility", category: "Utilities" },
      { text: "water sewer waste management", category: "Utilities" },
      { text: "internet wifi broadband comcast att verizon", category: "Utilities" },
      { text: "phone mobile cell service plan", category: "Utilities" },
      { text: "heating cooling hvac gas bill", category: "Utilities" },
      
      // Healthcare
      { text: "pharmacy cvs walgreens prescription medicine medication", category: "Healthcare" },
      { text: "doctor dentist medical clinic hospital", category: "Healthcare" },
      { text: "insurance health premium medical", category: "Healthcare" },
      { text: "gym fitness membership workout exercise", category: "Healthcare" },
      
      // Miscellaneous
      { text: "atm withdrawal cash bank fee", category: "Miscellaneous" },
      { text: "donation charity contribute give", category: "Miscellaneous" },
      { text: "gift present birthday wedding", category: "Miscellaneous" },
    ];

    this.train(trainingData);
  }
}
