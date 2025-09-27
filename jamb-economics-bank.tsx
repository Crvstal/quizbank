import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Zap, Target, Database, Brain, FileText, Clock, Award, X, Info, ChevronDown, ChevronUp, RotateCcw, Download, TrendingUp, DollarSign } from 'lucide-react';

const JAMBEconomicsBank = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    questionType: 'all',
    infoType: 'all',
    difficulty: 'all',
    topic: 'all'
  });
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Question classification framework
  const questionTypes = {
    pragmatic: { name: 'Pragmatic', icon: Target, color: 'bg-blue-500', description: 'Market applications' },
    logical: { name: 'Logical', icon: Brain, color: 'bg-purple-500', description: 'Economic reasoning' },
    canon: { name: 'Canon/Definitions', icon: FileText, color: 'bg-green-500', description: 'Economic terms' },
    statistics: { name: 'Data Analysis', icon: Database, color: 'bg-orange-500', description: 'Economic indicators' },
    mathematical: { name: 'Mathematical', icon: TrendingUp, color: 'bg-red-500', description: 'Calculations and graphs' }
  };

  const informationTypes = {
    essential: { name: 'Essential', color: 'border-l-4 border-red-400', description: 'Core economic concepts' },
    contextual: { name: 'Contextual', color: 'border-l-4 border-blue-400', description: 'Nigerian economic context' },
    abstract: { name: 'Abstract', color: 'border-l-4 border-purple-400', description: 'Economic theories' },
    supply_chain: { name: 'Applied Economics', color: 'border-l-4 border-green-400', description: 'Business applications' },
    proofs: { name: 'Models/Graphs', color: 'border-l-4 border-orange-400', description: 'Economic models' }
  };

  // Generate comprehensive JAMB Economics question bank
  const generateEconomicsQuestionBank = () => {
    const questionBank = [];
    
    const economicsTopics = [
      'Basic Economic Problems', 'Demand and Supply', 'Elasticity', 'Market Structure',
      'Theory of Production', 'Cost and Revenue', 'National Income', 'Money and Banking',
      'Public Finance', 'International Trade', 'Economic Growth', 'Economic Development',
      'Population', 'Natural Resources', 'Agriculture', 'Industrialization',
      'Transportation', 'Communication', 'Economic Planning', 'Economic Integration'
    ];

    const economicsQuestionTemplates = [
      // Demand and Supply - Mathematical
      {
        template: "Demand and supply calculations",
        type: 'mathematical', info: 'proofs',
        generator: () => {
          const prices = [10, 20, 30, 40, 50];
          const quantities = [100, 80, 60, 40, 20];
          const priceIndex = Math.floor(Math.random() * prices.length);
          const price = prices[priceIndex];
          const quantity = quantities[priceIndex];
          
          return {
            question: `If the price of a commodity is ₦${price} and the quantity demanded is ${quantity} units, what happens to quantity demanded when price increases to ₦${price + 10}?`,
            options: [
              'Quantity demanded decreases',
              'Quantity demanded increases',
              'Quantity demanded remains constant',
              'Quantity demanded becomes zero'
            ],
            correct: 0,
            explanation: `According to the law of demand, when price increases from ₦${price} to ₦${price + 10}, quantity demanded decreases due to the inverse relationship between price and quantity demanded`
          };
        }
      },

      // Market Structure - Canon
      {
        template: "Market structure definitions",
        type: 'canon', info: 'essential',
        generator: () => {
          const markets = [
            { name: 'Perfect Competition', feature: 'many sellers, homogeneous products', example: 'agricultural markets' },
            { name: 'Monopoly', feature: 'single seller, no close substitutes', example: 'public utilities' },
            { name: 'Oligopoly', feature: 'few large sellers, interdependent decisions', example: 'automobile industry' },
            { name: 'Monopolistic Competition', feature: 'many sellers, differentiated products', example: 'restaurant industry' }
          ];
          
          const market = markets[Math.floor(Math.random() * markets.length)];
          const wrongFeatures = markets.filter(m => m.name !== market.name).map(m => m.feature);
          
          return {
            question: `${market.name} is characterized by:`,
            options: [
              market.feature,
              ...wrongFeatures.slice(0, 3)
            ],
            correct: 0,
            explanation: `${market.name} is characterized by ${market.feature}, as seen in ${market.example}`
          };
        }
      },

      // National Income - Pragmatic
      {
        template: "National income applications",
        type: 'pragmatic', info: 'supply_chain',
        generator: () => {
          const concepts = [
            { concept: 'GDP', description: 'total value of goods and services produced within a country', use: 'measuring economic performance' },
            { concept: 'GNP', description: 'total value of goods and services produced by citizens', use: 'measuring national wealth' },
            { concept: 'Per capita income', description: 'average income per person', use: 'comparing living standards' },
            { concept: 'Real GDP', description: 'GDP adjusted for inflation', use: 'measuring actual economic growth' }
          ];
          
          const concept = concepts[Math.floor(Math.random() * concepts.length)];
          
          return {
            question: `${concept.concept} is best described as:`,
            options: [
              concept.description,
              concepts.find(c => c.concept !== concept.concept).description,
              'government revenue minus expenditure',
              'total exports minus imports'
            ],
            correct: 0,
            explanation: `${concept.concept} represents ${concept.description} and is useful for ${concept.use}`
          };
        }
      },

      // Economic Theory - Logical
      {
        template: "Economic reasoning",
        type: 'logical', info: 'abstract',
        generator: () => {
          const scenarios = [
            { situation: 'increase in consumer income', good: 'normal good', effect: 'demand increases', reason: 'higher purchasing power' },
            { situation: 'decrease in consumer income', good: 'inferior good', effect: 'demand increases', reason: 'substitution from expensive goods' },
            { situation: 'increase in price of substitute', good: 'original good', effect: 'demand increases', reason: 'consumers switch to relatively cheaper alternative' },
            { situation: 'increase in price of complement', good: 'original good', effect: 'demand decreases', reason: 'total cost of consumption increases' }
          ];
          
          const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
          
          return {
            question: `When there is an ${scenario.situation}, the demand for a ${scenario.good} will:`,
            options: [
              scenario.effect,
              scenario.effect.includes('increases') ? 'decrease' : 'increase',
              'remain unchanged',
              'become perfectly elastic'
            ],
            correct: 0,
            explanation: `${scenario.situation} causes demand to ${scenario.effect} because of ${scenario.reason}`
          };
        }
      },

      // Economic Data - Statistics
      {
        template: "Economic indicators analysis",
        type: 'statistics', info: 'contextual',
        generator: () => {
          const indicators = [
            { indicator: 'Inflation rate', measurement: '15% annually', implication: 'rapidly rising prices', policy: 'contractionary monetary policy' },
            { indicator: 'Unemployment rate', measurement: '25%', implication: 'high joblessness', policy: 'expansionary fiscal policy' },
            { indicator: 'GDP growth rate', measurement: '2.5% annually', implication: 'moderate economic expansion', policy: 'maintain current policies' },
            { indicator: 'Balance of trade', measurement: '₦500 billion deficit', implication: 'imports exceed exports', policy: 'export promotion' }
          ];
          
          const indicator = indicators[Math.floor(Math.random() * indicators.length)];
          
          return {
            question: `If Nigeria's ${indicator.indicator} is ${indicator.measurement}, this indicates:`,
            options: [
              indicator.implication,
              indicators.find(i => i.indicator !== indicator.indicator).implication,
              'economic equilibrium',
              'perfect market conditions'
            ],
            correct: 0,
            explanation: `A ${indicator.indicator} of ${indicator.measurement} suggests ${indicator.implication}, requiring ${indicator.policy}`
          };
        }
      },

      // Public Finance - Canon
      {
        template: "Government fiscal policy",
        type: 'canon', info: 'essential',
        generator: () => {
          const policies = [
            { policy: 'Expansionary fiscal policy', action: 'increase government spending and reduce taxes', goal: 'stimulate economic growth' },
            { policy: 'Contractionary fiscal policy', action: 'decrease government spending and increase taxes', goal: 'control inflation' },
            { policy: 'Progressive taxation', action: 'higher tax rates for higher incomes', goal: 'reduce income inequality' },
            { policy: 'Regressive taxation', action: 'same tax rate for all income levels', goal: 'simplify tax collection' }
          ];
          
          const policy = policies[Math.floor(Math.random() * policies.length)];
          
          return {
            question: `${policy.policy} involves:`,
            options: [
              policy.action,
              policies.find(p => p.policy !== policy.policy).action,
              'maintaining constant government spending',
              'eliminating all taxes'
            ],
            correct: 0,
            explanation: `${policy.policy} involves ${policy.action} to ${policy.goal}`
          };
        }
      },

      // International Trade - Mathematical
      {
        template: "Trade calculations",
        type: 'mathematical', info: 'proofs',
        generator: () => {
          const exports = [500, 750, 1000, 1250][Math.floor(Math.random() * 4)];
          const imports = [600, 800, 900, 1100][Math.floor(Math.random() * 4)];
          const balance = exports - imports;
          
          return {
            question: `If Nigeria's exports are ₦${exports} billion and imports are ₦${imports} billion, the balance of trade is:`,
            options: [
              `₦${balance} billion ${balance >= 0 ? 'surplus' : 'deficit'}`,
              `₦${exports + imports} billion surplus`,
              `₦${imports} billion deficit`,
              `₦${exports} billion surplus`
            ],
            correct: 0,
            explanation: `Balance of trade = Exports - Imports = ₦${exports}b - ₦${imports}b = ₦${balance}b ${balance >= 0 ? 'surplus' : 'deficit'}`
          };
        }
      },

      // Banking - Pragmatic
      {
        template: "Money and banking functions",
        type: 'pragmatic', info: 'supply_chain',
        generator: () => {
          const functions = [
            { institution: 'Central Bank', function: 'monetary policy implementation', example: 'controlling money supply' },
            { institution: 'Commercial Banks', function: 'financial intermediation', example: 'accepting deposits and giving loans' },
            { institution: 'Development Banks', function: 'long-term financing', example: 'funding infrastructure projects' },
            { institution: 'Microfinance Banks', function: 'small-scale financial services', example: 'lending to small businesses' }
          ];
          
          const bank = functions[Math.floor(Math.random() * functions.length)];
          
          return {
            question: `The primary function of ${bank.institution} is:`,
            options: [
              bank.function,
              functions.find(f => f.institution !== bank.institution).function,
              'foreign exchange trading only',
              'insurance provision only'
            ],
            correct: 0,
            explanation: `${bank.institution} primarily performs ${bank.function}, such as ${bank.example}`
          };
        }
      }
    ];

    // Generate 300 Economics questions across topics
    economicsTopics.forEach((topic, topicIndex) => {
      const questionsPerTopic = Math.floor(300 / economicsTopics.length);
      const extraQuestions = topicIndex < (300 % economicsTopics.length) ? 1 : 0;
      const totalQuestions = questionsPerTopic + extraQuestions;
      
      for (let i = 0; i < totalQuestions; i++) {
        const template = economicsQuestionTemplates[i % economicsQuestionTemplates.length];
        const generated = template.generator();
        questionBank.push({
          id: `jamb_econ_${(topicIndex * questionsPerTopic + i + 1).toString().padStart(3, '0')}`,
          subject: 'Economics',
          questionType: template.type,
          infoType: template.info,
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
          topic: topic,
          source: 'JAMB Economics Syllabus 2025',
          examType: 'JAMB/UTME',
          ...generated
        });
      }
    });

    return questionBank;
  };

  // Initialize question bank
  useEffect(() => {
    setLoading(true);
    const questionBank = generateEconomicsQuestionBank();
    setQuestions(questionBank);
    setFilteredQuestions(questionBank);
    setLoading(false);
  }, []);

  // Search and filter logic
  const performSearch = useMemo(() => {
    let result = [...questions];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(q => 
        q.question.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query) ||
        q.explanation.toLowerCase().includes(query) ||
        q.options.some(opt => opt.toLowerCase().includes(query))
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== 'all') {
        result = result.filter(q => q[key] === value);
      }
    });

    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return result;
  }, [questions, searchQuery, filters, sortBy, sortOrder]);

  useEffect(() => {
    setFilteredQuestions(performSearch);
    setCurrentPage(1);
  }, [performSearch]);

  // Pagination
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  // Export functionality
  const exportData = () => {
    const dataStr = JSON.stringify(filteredQuestions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `jamb_economics_${new Date().getTime()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: filteredQuestions.length,
      byDifficulty: {
        Easy: filteredQuestions.filter(q => q.difficulty === 'Easy').length,
        Medium: filteredQuestions.filter(q => q.difficulty === 'Medium').length,
        Hard: filteredQuestions.filter(q => q.difficulty === 'Hard').length
      },
      byType: Object.keys(questionTypes).reduce((acc, type) => {
        acc[type] = filteredQuestions.filter(q => q.questionType === type).length;
        return acc;
      }, {}),
      topicCoverage: [...new Set(filteredQuestions.map(q => q.topic))].length
    };
  }, [filteredQuestions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading JAMB Economics question bank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">JAMB Economics Question Bank</h1>
            <p className="text-gray-600">300 comprehensive economics questions for UTME preparation</p>
          </div>
        </div>
        
        {/* Economics Focus Areas */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">JAMB Economics Priority Topics</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-yellow-700">
            <div>• Microeconomics (30%)</div>
            <div>• Macroeconomics (25%)</div>
            <div>• Nigerian Economy (20%)</div>
            <div>• International Economics (15%)</div>
            <div>• Economic Development (10%)</div>
            <div className="font-medium">• Nigerian context emphasized</div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.total}</div>
            <div className="text-sm text-yellow-800">Total Questions</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.topicCoverage}</div>
            <div className="text-sm text-blue-800">Topics Covered</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.byDifficulty.Easy}</div>
            <div className="text-sm text-green-800">Easy</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.byDifficulty.Medium}</div>
            <div className="text-sm text-orange-800">Medium</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.byDifficulty.Hard}</div>
            <div className="text-sm text-red-800">Hard</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.byType.mathematical}</div>
            <div className="text-sm text-purple-800">Calculations</div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search economics questions, concepts, theories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <button
              onClick={exportData}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  questionType: 'all',
                  infoType: 'all',
                  difficulty: 'all',
                  topic: 'all'
                });
                setSortBy('id');
                setSortOrder('asc');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                <select
                  value={filters.questionType}
                  onChange={(e) => setFilters({...filters, questionType: e.target.value})}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                >
                  <option value="all">All Types</option>
                  {Object.entries(questionTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Info Type</label>
                <select
                  value={filters.infoType}
                  onChange={(e) => setFilters({...filters, infoType: e.target.value})}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                >
                  <option value="all">All Info Types</option>
                  {Object.entries(informationTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                >
                  <option value="id">ID</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="topic">Topic</option>
                  <option value="questionType">Question Type</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Economics Questions ({filteredQuestions.length} found)
          </h2>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="p-1 border rounded text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Question List */}
        <div className="space-y-4">
          {paginatedQuestions.map((question) => {
            const QuestionIcon = questionTypes[question.questionType].icon;
            return (
              <div 
                key={question.id}
                className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${informationTypes[question.infoType].color}`}
                onClick={() => {
                  setSelectedQuestion(question);
                  setShowModal(true);
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <QuestionIcon className="w-5 h-5 text-gray-600" />
                    <div>
                      <span className="font-medium text-lg">{question.id}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">Economics</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{question.topic}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                      Economics
                    </span>
                    <span className={`px-2 py-1 rounded text-xs text-white ${questionTypes[question.questionType].color}`}>
                      {questionTypes[question.questionType].name}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-800 font-medium">{question.question}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {question.options.map((option, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 rounded border ${idx === question.correct ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-yellow-600 text-white' : 'hover:bg-gray-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Question Detail Modal */}
      {showModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedQuestion.id}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      {selectedQuestion.subject}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm text-white ${questionTypes[selectedQuestion.questionType].color}`}>
                      {questionTypes[selectedQuestion.questionType].name}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                      {selectedQuestion.topic}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Question:</h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedQuestion.question}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Options:</h4>
                <div className="space-y-2">
                  {selectedQuestion.options.map((option, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        idx === selectedQuestion.correct 
                          ? 'bg-yellow-50 border-yellow-300 text-yellow-800' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
                      {idx === selectedQuestion.correct && (
                        <span className="ml-2 text-yellow-600 font-semibold">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Explanation:
                </h4>
                <p className="text-blue-700">{selectedQuestion.explanation}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Difficulty:</span> {selectedQuestion.difficulty}
                  </div>
                  <div>
                    <span className="font-medium">Source:</span> {selectedQuestion.source}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JAMBEconomicsBank;