import { Brain, TrendingUp, PieChart, Zap, Shield, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Categorization",
      description: "Naive Bayes machine learning automatically categorizes your expenses with increasing accuracy."
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Visualize spending patterns with interactive charts and category breakdowns."
    },
    {
      icon: Zap,
      title: "Instant Predictions",
      description: "Get real-time category suggestions as you type expense descriptions."
    },
    {
      icon: Clock,
      title: "Continuous Learning",
      description: "The AI model improves over time as you correct predictions and add expenses."
    },
    {
      icon: PieChart,
      title: "Category Insights",
      description: "Track spending across multiple categories with detailed monthly trends."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "All data and AI processing happens locally in your browser."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl text-foreground">Smart Expense Tracker</span>
            </div>
            <button
              onClick={() => navigate('/app')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            AI-Powered Expense Management
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            Track Expenses with
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intelligent AI
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in">
            Let machine learning automatically categorize your spending. The more you use it, the smarter it becomes. 
            No setup required—start tracking instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <button
              onClick={() => navigate('/app')}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 group"
            >
              Launch Tracker
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-border px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent/10 transition-colors">
              Watch Demo
            </button>
          </div>

          {/* Hero Illustration */}
          <div className="mt-16 relative animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full"></div>
            <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Spent', value: '$2,847.50', color: 'text-primary' },
                  { label: 'Transactions', value: '127', color: 'text-accent' },
                  { label: 'Categories', value: '7', color: 'text-orange-500' }
                ].map((stat, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage expenses intelligently with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, intelligent expense tracking in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Add Expense', desc: 'Enter description and amount' },
              { step: '02', title: 'AI Categorizes', desc: 'Machine learning predicts category' },
              { step: '03', title: 'Track & Analyze', desc: 'View insights and spending patterns' }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {i < 2 && (
                  <ArrowRight className="hidden md:block absolute top-12 -right-6 w-8 h-8 text-primary/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start tracking your expenses intelligently with AI-powered categorization
          </p>
          <button
            onClick={() => navigate('/app')}
            className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            Launch Tracker Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2024 Smart Expense Tracker. Built with AI and ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
