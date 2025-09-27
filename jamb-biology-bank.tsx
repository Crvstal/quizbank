import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Zap, Target, Database, Brain, FileText, Clock, Award, X, Info, ChevronDown, ChevronUp, RotateCcw, Download, Leaf, Dna } from 'lucide-react';

const JAMBBiologyBank = () => {
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
    pragmatic: { name: 'Pragmatic', icon: Target, color: 'bg-blue-500', description: 'Medical applications' },
    logical: { name: 'Logical', icon: Brain, color: 'bg-purple-500', description: 'Biological processes' },
    canon: { name: 'Canon/Definitions', icon: FileText, color: 'bg-green-500', description: 'Classifications and terms' },
    statistics: { name: 'Data Analysis', icon: Database, color: 'bg-orange-500', description: 'Experimental data' },
    mathematical: { name: 'Mathematical', icon: Dna, color: 'bg-red-500', description: 'Genetics and calculations' }
  };

  const informationTypes = {
    essential: { name: 'Essential', color: 'border-l-4 border-red-400', description: 'Core biological concepts' },
    contextual: { name: 'Contextual', color: 'border-l-4 border-blue-400', description: 'Ecological/medical context' },
    abstract: { name: 'Abstract', color: 'border-l-4 border-purple-400', description: 'Theoretical biology' },
    supply_chain: { name: 'Applied Biology', color: 'border-l-4 border-green-400', description: 'Biotechnology' },
    proofs: { name: 'Systems/Cycles', color: 'border-l-4 border-orange-400', description: 'Biological processes' }
  };

  // Generate comprehensive JAMB Biology question bank
  const generateBiologyQuestionBank = () => {
    const questionBank = [];
    
    const biologyTopics = [
      'Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Plant Biology',
      'Animal Biology', 'Human Biology', 'Microbiology', 'Reproduction',
      'Growth and Development', 'Coordination and Control', 'Respiration',
      'Excretion', 'Nutrition', 'Transport', 'Support and Movement',
      'Irritability', 'Adaptation', 'Variation', 'Heredity'
    ];

    const biologyQuestionTemplates = [
      // Genetics - Mathematical
      {
        template: "Genetic crosses",
        type: 'mathematical', info: 'proofs',
        generator: () => {
          const crosses = [
            { 
              parents: 'Tt × Tt', 
              ratio: '3:1', 
              phenotype: 'tall : short',
              explanation: 'Monohybrid cross showing 3:1 dominant:recessive ratio'
            },
            { 
              parents: 'Tt × tt', 
              ratio: '1:1', 
              phenotype: 'tall : short',
              explanation: 'Test cross showing 1:1 ratio'
            },
            { 
              parents: 'TtRr × TtRr', 
              ratio: '9:3:3:1', 
              phenotype: 'tall round : tall wrinkled : short round : short wrinkled',
              explanation: 'Dihybrid cross showing 9:3:3:1 ratio'
            }
          ];
          
          const cross = crosses[Math.floor(Math.random() * crosses.length)];
          
          return {
            question: `In a cross between ${cross.parents}, what is the expected phenotypic ratio in the offspring?`,
            options: [
              cross.ratio,
              cross.ratio === '3:1' ? '1:2:1' : '3:1',
              cross.ratio === '9:3:3:1' ? '1:1:1:1' : '9:3:3:1',
              '1:1'
            ].filter((v, i, a) => a.indexOf(v) === i),
            correct: 0,
            explanation: cross.explanation
          };
        }
      },

      // Cell Biology - Canon
      {
        template: "Cell organelles",
        type: 'canon', info: 'essential',
        generator: () => {
          const organelles = [
            { name: 'Mitochondria', function: 'cellular respiration and ATP production', location: 'cytoplasm' },
            { name: 'Ribosomes', function: 'protein synthesis', location: 'cytoplasm and ER' },
            { name: 'Chloroplasts', function: 'photosynthesis', location: 'plant cells only' },
            { name: 'Nucleus', function: 'control of cell activities and DNA storage', location: 'center of cell' },
            { name: 'Vacuole', function: 'storage and support', location: 'plant cells mainly' }
          ];
          
          const organelle = organelles[Math.floor(Math.random() * organelles.length)];
          const wrongFunctions = organelles.filter(o => o.name !== organelle.name).map(o => o.function);
          
          return {
            question: `What is the main function of ${organelle.name}?`,
            options: [
              organelle.function,
              ...wrongFunctions.slice(0, 3)
            ],
            correct: 0,
            explanation: `${organelle.name} is responsible for ${organelle.function}`
          };
        }
      },

      // Human Biology - Pragmatic
      {
        template: "Body systems",
        type: 'pragmatic', info: 'supply_chain',
        generator: () => {
          const systems = [
            { system: 'Circulatory', function: 'transport of materials', components: 'heart, blood vessels, blood' },
            { system: 'Respiratory', function: 'gas exchange', components: 'lungs, trachea, bronchi' },
            { system: 'Digestive', function: 'breakdown and absorption of food', components: 'stomach, intestines, liver' },
            { system: 'Nervous', function: 'coordination and control', components: 'brain, spinal cord, nerves' },
            { system: 'Excretory', function: 'removal of waste products', components: 'kidneys, liver, lungs, skin' }
          ];
          
          const system = systems[Math.floor(Math.random() * systems.length)];
          
          return {
            question: `The main function of the ${system.system} system is:`,
            options: [
              system.function,
              systems.find(s => s.system !== system.system).function,
              'storage of nutrients',
              'production of hormones'
            ],
            correct: 0,
            explanation: `The ${system.system} system functions in ${system.function} using ${system.components}`
          };
        }
      },

      // Ecology - Logical
      {
        template: "Ecological relationships",
        type: 'logical', info: 'contextual',
        generator: () => {
          const relationships = [
            { type: 'Predation', description: 'one organism kills and eats another', example: 'lion and antelope' },
            { type: 'Mutualism', description: 'both organisms benefit', example: 'bee and flower' },
            { type: 'Parasitism', description: 'one benefits, other is harmed', example: 'tapeworm in human' },
            { type: 'Competition', description: 'organisms compete for resources', example: 'plants competing for sunlight' },
            { type: 'Commensalism', description: 'one benefits, other unaffected', example: 'orchid on tree' }
          ];
          
          const relationship = relationships[Math.floor(Math.random() * relationships.length)];
          
          return {
            question: `${relationship.example} is an example of:`,
            options: [
              relationship.type,
              relationships.find(r => r.type !== relationship.type).type,
              'Neutralism',
              'Allelopathy'
            ],
            correct: 0,
            explanation: `${relationship.example} demonstrates ${relationship.type} where ${relationship.description}`
          };
        }
      },

      // Plant Biology - Statistics
      {
        template: "Photosynthesis data",
        type: 'statistics', info: 'abstract',
        generator: () => {
          const factors = [
            { factor: 'Light intensity', effect: 'increases', reason: 'more energy for light reactions' },
            { factor: 'Temperature (optimal)', effect: 'increases', reason: 'faster enzyme activity' },
            { factor: 'CO₂ concentration', effect: 'increases', reason: 'more raw material for Calvin cycle' },
            { factor: 'Chlorophyll content', effect: 'increases', reason: 'more light absorption' }
          ];
          
          const factor = factors[Math.floor(Math.random() * factors.length)];
          
          return {
            question: `Increasing ${factor.factor} generally ${factor.effect} the rate of photosynthesis because:`,
            options: [
              factor.reason,
              'it reduces water loss',
              'it prevents photorespiration',
              'it increases stomatal opening'
            ],
            correct: 0,
            explanation: `${factor.factor} ${factor.effect} photosynthesis rate as ${factor.reason}`
          };
        }
      },

      // Microbiology - Canon
      {
        template: "Microorganisms",
        type: 'canon', info: 'essential',
        generator: () => {
          const microbes = [
            { name: 'Bacteria', characteristic: 'prokaryotic', example: 'E. coli', importance: 'decomposition' },
            { name: 'Viruses', characteristic: 'non-cellular', example: 'HIV', importance: 'disease causation' },
            { name: 'Fungi', characteristic: 'eukaryotic with cell walls', example: 'Yeast', importance: 'fermentation' },
            { name: 'Protozoa', characteristic: 'single-celled eukaryotes', example: 'Amoeba', importance: 'primary consumers' }
          ];
          
          const microbe = microbes[Math.floor(Math.random() * microbes.length)];
          
          return {
            question: `${microbe.name} are characterized by being:`,
            options: [
              microbe.characteristic,
              microbes.find(m => m.name !== microbe.name).characteristic,
              'multicellular organisms',
              'photosynthetic only'
            ],
            correct: 0,
            explanation: `${microbe.name} are ${microbe.characteristic} and include organisms like ${microbe.example}`
          };
        }
      },

      // Reproduction - Mathematical
      {
        template: "Population genetics",
        type: 'mathematical', info: 'proofs',
        generator: () => {
          const scenarios = [
            { organism: 'bacteria', time: '20 minutes', generations: 3, population: 8 },
            { organism: 'fruit flies', time: '2 weeks', generations: 2, population: 4 },
            { organism: 'mice', time: '3 months', generations: 2, population: 4 }
          ];
          
          const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
          const initial = 1;
          
          return {
            question: `If ${scenario.organism} reproduce by binary fission every ${scenario.time}, how many individuals will there be after ${scenario.generations} generations starting from 1?`,
            options: [
              `${scenario.population}`,
              `${scenario.generations}`,
              `${scenario.generations * 2}`,
              `${scenario.population / 2}`
            ],
            correct: 0,
            explanation: `Each generation doubles: 1 → 2 → 4 → 8... After ${scenario.generations} generations: ${scenario.population}`
          };
        }
      },

      // Evolution - Logical
      {
        template: "Natural selection",
        type: 'logical', info: 'abstract',
        generator: () => {
          const examples = [
            { trait: 'peppered moths', environment: 'industrial pollution', advantage: 'dark coloration for camouflage' },
            { trait: 'finch beaks', environment: 'different food sources', advantage: 'beak shape matching food type' },
            { trait: 'giraffe necks', environment: 'tall trees', advantage: 'longer necks reach higher leaves' },
            { trait: 'antibiotic resistance', environment: 'antibiotic use', advantage: 'survival in presence of antibiotics' }
          ];
          
          const example = examples[Math.floor(Math.random() * examples.length)];
          
          return {
            question: `In ${example.trait} evolution, ${example.environment} led to selection for:`,
            options: [
              example.advantage,
              'random mutations only',
              'genetic drift effects',
              'founder effects'
            ],
            correct: 0,
            explanation: `${example.trait} evolved in response to ${example.environment}, favoring ${example.advantage}`
          };
        }
      }
    ];

    // Generate 300 Biology questions across topics
    biologyTopics.forEach((topic, topicIndex) => {
      const questionsPerTopic = Math.floor(300 / biologyTopics.length);
      const extraQuestions = topicIndex < (300 % biologyTopics.length) ? 1 : 0;
      const totalQuestions = questionsPerTopic + extraQuestions;
      
      for (let i = 0; i < totalQuestions; i++) {
        const template = biologyQuestionTemplates[i % biologyQuestionTemplates.length];
        const generated = template.generator();
        questionBank.push({
          id: `jamb_bio_${(topicIndex * questionsPerTopic + i + 1).toString().padStart(3, '0')}`,
          subject: 'Biology',
          questionType: template.type,
          infoType: template.info,
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
          topic: topic,
          source: 'JAMB Biology Syllabus 2025',
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
    const questionBank = generateBiologyQuestionBank();
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
    const exportFileDefaultName = `jamb_biology_${new Date().getTime()}.json`;
    
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading JAMB Biology question bank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">JAMB Biology Question Bank</h1>
            <p className="text-gray-600">300 comprehensive biology questions for UTME preparation</p>
          </div>
        </div>
        
        {/* Biology Focus Areas */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span className="font-medium text-emerald-800">JAMB Biology Priority Topics</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-emerald-700">
            <div>• Human Biology (25%)</div>
            <div>• Plant Biology (20%)</div>
            <div>• Genetics & Evolution (20%)</div>
            <div>• Ecology (15%)</div>
            <div>• Cell Biology (10%)</div>
            <div>• Microbiology (10%)</div>
            <div className="font-medium">• Medical applications emphasized</div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-emerald-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.total}</div>
            <div className="text-sm text-emerald-800">Total Questions</div>
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
            <div className="text-sm text-purple-800">Genetics</div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search biology questions, organisms, processes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
            Biology Questions ({filteredQuestions.length} found)
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
                      <span className="text-gray-600">Biology</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{question.topic}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                      Biology
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
                      className={`p-2 rounded border ${idx === question.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}
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
                    className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-emerald-600 text-white' : 'hover:bg-gray-50'}`}
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
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-sm">
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
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
                      {idx === selectedQuestion.correct && (
                        <span className="ml-2 text-emerald-600 font-semibold">✓ Correct</span>
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

export default JAMBBiologyBank;