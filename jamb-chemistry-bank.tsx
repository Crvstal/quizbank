import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Zap, Target, Database, Brain, FileText, Clock, Award, X, Info, ChevronDown, ChevronUp, RotateCcw, Download, Atom, Beaker } from 'lucide-react';

const JAMBChemistryBank = () => {
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
    pragmatic: { name: 'Pragmatic', icon: Target, color: 'bg-blue-500', description: 'Industrial applications' },
    logical: { name: 'Logical', icon: Brain, color: 'bg-purple-500', description: 'Reaction mechanisms' },
    canon: { name: 'Canon/Definitions', icon: FileText, color: 'bg-green-500', description: 'Laws and definitions' },
    statistics: { name: 'Data Analysis', icon: Database, color: 'bg-orange-500', description: 'Quantitative analysis' },
    mathematical: { name: 'Mathematical', icon: Beaker, color: 'bg-red-500', description: 'Calculations and stoichiometry' }
  };

  const informationTypes = {
    essential: { name: 'Essential', color: 'border-l-4 border-red-400', description: 'Core chemistry concepts' },
    contextual: { name: 'Contextual', color: 'border-l-4 border-blue-400', description: 'Industrial/environmental context' },
    abstract: { name: 'Abstract', color: 'border-l-4 border-purple-400', description: 'Theoretical chemistry' },
    supply_chain: { name: 'Applied Chemistry', color: 'border-l-4 border-green-400', description: 'Manufacturing processes' },
    proofs: { name: 'Formulas/Equations', color: 'border-l-4 border-orange-400', description: 'Chemical equations' }
  };

  // Generate comprehensive JAMB Chemistry question bank
  const generateChemistryQuestionBank = () => {
    const questionBank = [];
    
    const chemistryTopics = [
      'Atomic Structure', 'Chemical Bonding', 'Gaseous State', 'Solutions', 
      'Thermochemistry', 'Reaction Rates', 'Chemical Equilibrium', 'Acids and Bases',
      'Redox Reactions', 'Electrochemistry', 'Periodic Table', 'Group Chemistry',
      'Hydrocarbons', 'Alcohols and Ethers', 'Organic Acids', 'Polymers',
      'Metals and Alloys', 'Non-metals', 'Environmental Chemistry', 'Chemical Industries'
    ];

    const chemistryQuestionTemplates = [
      // Stoichiometry - Mathematical
      {
        template: "Stoichiometric calculations",
        type: 'mathematical', info: 'essential',
        generator: () => {
          const compounds = [
            { name: 'NaCl', molar: 58.5 },
            { name: 'H₂SO₄', molar: 98 },
            { name: 'CaCO₃', molar: 100 },
            { name: 'NH₃', molar: 17 }
          ];
          
          const compound = compounds[Math.floor(Math.random() * compounds.length)];
          const mass = [5, 10, 15, 20, 25][Math.floor(Math.random() * 5)];
          const moles = (mass / compound.molar).toFixed(3);
          
          return {
            question: `Calculate the number of moles in ${mass}g of ${compound.name}. (Molar mass = ${compound.molar} g/mol)`,
            options: [
              `${moles} mol`,
              `${(mass * compound.molar).toFixed(1)} mol`,
              `${(mass + compound.molar).toFixed(1)} mol`,
              `${(compound.molar / mass).toFixed(3)} mol`
            ],
            correct: 0,
            explanation: `Moles = mass / molar mass = ${mass} / ${compound.molar} = ${moles} mol`
          };
        }
      },

      // Organic Chemistry - Canon
      {
        template: "Organic nomenclature",
        type: 'canon', info: 'essential',
        generator: () => {
          const alkanes = [
            { formula: 'CH₄', name: 'Methane', carbons: 1 },
            { formula: 'C₂H₆', name: 'Ethane', carbons: 2 },
            { formula: 'C₃H₈', name: 'Propane', carbons: 3 },
            { formula: 'C₄H₁₀', name: 'Butane', carbons: 4 },
            { formula: 'C₅H₁₂', name: 'Pentane', carbons: 5 }
          ];
          
          const alkane = alkanes[Math.floor(Math.random() * alkanes.length)];
          const wrongOptions = alkanes.filter(a => a.name !== alkane.name).slice(0, 3);
          
          return {
            question: `What is the IUPAC name of ${alkane.formula}?`,
            options: [
              alkane.name,
              ...wrongOptions.map(a => a.name)
            ],
            correct: 0,
            explanation: `${alkane.formula} has ${alkane.carbons} carbon atoms, so it is ${alkane.name}`
          };
        }
      },

      // Acids and Bases - Pragmatic
      {
        template: "pH calculations",
        type: 'pragmatic', info: 'supply_chain',
        generator: () => {
          const scenarios = [
            { substance: 'Lemon juice', ph: 2, type: 'acidic' },
            { substance: 'Pure water', ph: 7, type: 'neutral' },
            { substance: 'Soap solution', ph: 9, type: 'basic' },
            { substance: 'Gastric juice', ph: 1.5, type: 'strongly acidic' }
          ];
          
          const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
          
          return {
            question: `The pH of ${scenario.substance} is approximately ${scenario.ph}. This solution is:`,
            options: [
              scenario.type,
              scenario.type === 'acidic' ? 'basic' : 'acidic',
              'amphoteric',
              'neutral'
            ].filter((v, i, a) => a.indexOf(v) === i),
            correct: 0,
            explanation: `A pH of ${scenario.ph} indicates the solution is ${scenario.type}`
          };
        }
      },

      // Periodic Table - Logical
      {
        template: "Periodic trends",
        type: 'logical', info: 'abstract',
        generator: () => {
          const trends = [
            { property: 'Atomic radius', direction: 'decreases across period', reason: 'increasing nuclear charge' },
            { property: 'Ionization energy', direction: 'increases across period', reason: 'stronger nuclear attraction' },
            { property: 'Electronegativity', direction: 'increases across period', reason: 'stronger nuclear pull on electrons' },
            { property: 'Metallic character', direction: 'decreases across period', reason: 'increasing non-metallic properties' }
          ];
          
          const trend = trends[Math.floor(Math.random() * trends.length)];
          
          return {
            question: `${trend.property} generally ${trend.direction} because of:`,
            options: [
              trend.reason,
              'decreasing nuclear charge',
              'increasing atomic mass',
              'constant electron shielding'
            ],
            correct: 0,
            explanation: `${trend.property} ${trend.direction} due to ${trend.reason}`
          };
        }
      },

      // Reaction Kinetics - Statistics
      {
        template: "Reaction rates",
        type: 'statistics', info: 'contextual',
        generator: () => {
          const factors = [
            { factor: 'Temperature increase', effect: 'increases reaction rate', reason: 'more kinetic energy' },
            { factor: 'Catalyst addition', effect: 'increases reaction rate', reason: 'lowers activation energy' },
            { factor: 'Concentration increase', effect: 'increases reaction rate', reason: 'more frequent collisions' },
            { factor: 'Surface area increase', effect: 'increases reaction rate', reason: 'more contact points' }
          ];
          
          const factor = factors[Math.floor(Math.random() * factors.length)];
          
          return {
            question: `${factor.factor} generally ${factor.effect} because it:`,
            options: [
              factor.reason,
              'decreases activation energy always',
              'changes the equilibrium position',
              'alters the enthalpy change'
            ],
            correct: 0,
            explanation: `${factor.factor} ${factor.effect} because it provides ${factor.reason}`
          };
        }
      },

      // Chemical Bonding - Abstract
      {
        template: "Bonding types",
        type: 'logical', info: 'proofs',
        generator: () => {
          const bonds = [
            { compound: 'NaCl', bond: 'ionic', reason: 'metal + non-metal, electron transfer' },
            { compound: 'H₂O', bond: 'covalent', reason: 'non-metal + non-metal, electron sharing' },
            { compound: 'NH₃', bond: 'covalent', reason: 'non-metals sharing electrons' },
            { compound: 'CaO', bond: 'ionic', reason: 'metal + non-metal, electron transfer' }
          ];
          
          const bond = bonds[Math.floor(Math.random() * bonds.length)];
          
          return {
            question: `What type of bonding exists in ${bond.compound}?`,
            options: [
              `${bond.bond} bonding`,
              bond.bond === 'ionic' ? 'covalent bonding' : 'ionic bonding',
              'metallic bonding',
              'hydrogen bonding'
            ],
            correct: 0,
            explanation: `${bond.compound} has ${bond.bond} bonding because of ${bond.reason}`
          };
        }
      },

      // Electrochemistry - Mathematical
      {
        template: "Electrolysis calculations",
        type: 'mathematical', info: 'proofs',
        generator: () => {
          const current = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
          const time = [30, 60, 120, 180][Math.floor(Math.random() * 4)]; // minutes
          const charge = current * time * 60; // coulombs
          const moles = (charge / 96500).toFixed(4); // using Faraday's constant
          
          return {
            question: `How many moles of electrons flow when a current of ${current}A passes for ${time} minutes? (F = 96,500 C/mol)`,
            options: [
              `${moles} mol`,
              `${(charge / 1000).toFixed(2)} mol`,
              `${(current * time).toFixed(2)} mol`,
              `${(charge).toFixed(0)} mol`
            ],
            correct: 0,
            explanation: `Charge = ${current}A × ${time × 60}s = ${charge}C; Moles = ${charge}/96500 = ${moles} mol`
          };
        }
      },

      // Environmental Chemistry - Pragmatic
      {
        template: "Environmental applications",
        type: 'pragmatic', info: 'contextual',
        generator: () => {
          const pollutants = [
            { name: 'CO₂', effect: 'greenhouse effect', source: 'burning fossil fuels' },
            { name: 'SO₂', effect: 'acid rain', source: 'industrial emissions' },
            { name: 'CFCs', effect: 'ozone depletion', source: 'refrigerants and aerosols' },
            { name: 'NO₂', effect: 'smog formation', source: 'vehicle emissions' }
          ];
          
          const pollutant = pollutants[Math.floor(Math.random() * pollutants.length)];
          
          return {
            question: `${pollutant.name} is primarily responsible for:`,
            options: [
              pollutant.effect,
              pollutants.find(p => p.name !== pollutant.name).effect,
              'water purification',
              'soil enrichment'
            ],
            correct: 0,
            explanation: `${pollutant.name} from ${pollutant.source} causes ${pollutant.effect}`
          };
        }
      }
    ];

    // Generate 300 Chemistry questions across topics
    chemistryTopics.forEach((topic, topicIndex) => {
      const questionsPerTopic = Math.floor(300 / chemistryTopics.length);
      const extraQuestions = topicIndex < (300 % chemistryTopics.length) ? 1 : 0;
      const totalQuestions = questionsPerTopic + extraQuestions;
      
      for (let i = 0; i < totalQuestions; i++) {
        const template = chemistryQuestionTemplates[i % chemistryQuestionTemplates.length];
        const generated = template.generator();
        questionBank.push({
          id: `jamb_chem_${(topicIndex * questionsPerTopic + i + 1).toString().padStart(3, '0')}`,
          subject: 'Chemistry',
          questionType: template.type,
          infoType: template.info,
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
          topic: topic,
          source: 'JAMB Chemistry Syllabus 2025',
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
    const questionBank = generateChemistryQuestionBank();
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
    const exportFileDefaultName = `jamb_chemistry_${new Date().getTime()}.json`;
    
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading JAMB Chemistry question bank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">JAMB Chemistry Question Bank</h1>
            <p className="text-gray-600">300 comprehensive chemistry questions for UTME preparation</p>
          </div>
        </div>
        
        {/* Chemistry Focus Areas */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">JAMB Chemistry Priority Topics</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-green-700">
            <div>• Organic Chemistry (25%)</div>
            <div>• Physical Chemistry (25%)</div>
            <div>• Inorganic Chemistry (25%)</div>
            <div>• Environmental Chemistry (15%)</div>
            <div>• Chemical Industries (10%)</div>
            <div className="font-medium">• Practical applications emphasized</div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            <div className="text-sm text-green-800">Total Questions</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.topicCoverage}</div>
            <div className="text-sm text-blue-800">Topics Covered</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.byDifficulty.Easy}</div>
            <div className="text-sm text-yellow-800">Easy</div>
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
              placeholder="Search chemistry questions, formulas, reactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
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
            Chemistry Questions ({filteredQuestions.length} found)
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
                      <span className="text-gray-600">Chemistry</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{question.topic}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Chemistry
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
                      className={`p-2 rounded border ${idx === question.correct ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
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
                    className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-green-600 text-white' : 'hover:bg-gray-50'}`}
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
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
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
                          ? 'bg-green-50 border-green-300 text-green-800' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
                      {idx === selectedQuestion.correct && (
                        <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
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

export default JAMBChemistryBank;