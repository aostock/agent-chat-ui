export interface Assistant {
  name: string;
  title: string;
  description: string;
}

export const assistants: Assistant[] = [
  // {
  //   name: "agent",
  //   title: "Agent",
  //   description: "main agent",
  // },
  {
    name: "warren_buffett",
    title: "Warren Buffett",
    description:
      "The oracle of Omaha, seeks wonderful companies at a fair price",
  },
  {
    name: "aswath_damodaran",
    title: "Aswath Damodaran",
    description:
      "The Dean of Valuation, focuses on story, numbers, and disciplined valuation",
  },
  {
    name: "ben_graham",
    title: "Benjamin Graham",
    description:
      "The father of value investing, focuses on margin of safety and intrinsic value",
  },
  {
    name: "bill_ackman",
    title: "Bill Ackman",
    description:
      "Activist investor, focuses on high-quality businesses with activism potential",
  },
  {
    name: "cathie_wood",
    title: "Cathie Wood",
    description:
      "Disruptive innovation investor, focuses on breakthrough technologies and exponential growth",
  },
  {
    name: "charlie_munger",
    title: "Charlie Munger",
    description:
      "Value investor, focuses on business quality, predictability, and mental models",
  },
  {
    name: "fundamentals",
    title: "Fundamentals",
    description:
      "Focuses on comprehensive fundamental analysis of business quality and valuation",
  },
  {
    name: "michael_burry",
    title: "Michael Burry",
    description:
      "Focuses on market inefficiencies, financial forensics, and contrarian opportunities",
  },
  {
    name: "peter_lynch",
    title: "Peter Lynch",
    description:
      "Growth at a reasonable price investor, focuses on investing in what you know",
  },
  {
    name: "phil_fisher",
    title: "Phil Fisher",
    description:
      "Growth investor, focuses on long-term above-average growth potential and quality management",
  },
  {
    name: "portfolio_manager",
    title: "Portfolio Manager",
    description:
      "Professional portfolio manager making final trading decisions based on comprehensive analysis",
  },
  {
    name: "rakesh_jhunjhunwala",
    title: "Rakesh Jhunjhunwala",
    description:
      "The Indian Oracle, focuses on quality businesses with strong fundamentals and margin of safety",
  },
  {
    name: "risk_manager",
    title: "Risk Manager",
    description:
      "Professional risk manager focusing on position sizing and portfolio risk control",
  },
  {
    name: "sentiment",
    title: "Market Sentiment",
    description:
      "Analyzes market sentiment from news, social media, insider activity, and technical indicators",
  },
  {
    name: "stanley_druckenmiller",
    title: "Stanley Druckenmiller",
    description:
      "Macro investor, focuses on global market trends and adaptive investment strategies",
  },
  {
    name: "technicals",
    title: "Technical Analysis",
    description:
      "Focuses on technical analysis using trend, momentum, volatility, and statistical indicators",
  },
  {
    name: "trading",
    title: "Trading Assistant",
    description:
      "Professional trading assistant providing market analysis, sentiment analysis, and trading signals",
  },
  {
    name: "valuation",
    title: "Valuation Analysis",
    description:
      "Focuses on comprehensive valuation analysis using multiple methodologies including DCF, owner earnings, and relative valuation",
  },
  {
    name: "information_query",
    title: "Information Query",
    description:
      "Provides detailed company information and key financial metrics analysis",
  },
];
