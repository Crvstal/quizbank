import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Zap, Target, Database, Brain, FileText, Clock, Award, X, Info, ChevronDown, ChevronUp, RotateCcw, Download, Atom, Gauge } from 'lucide-react';

const JAMBPhysicsBank = () => {
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

  // Question classification framework for Physics
  const questionTypes = {
    pragmatic: { name: 'Pragmatic', icon: Target, color: 'bg-blue-500', description: 'Real-world applications' },
    logical: { name: 'Logical', icon: Brain, color: 'bg-purple-500', description: 'Problem-solving' },
    canon: { name: 'Canon/Definitions', icon: FileText, color: 'bg-green-500', description: 'Laws and definitions' },
    statistics: { name: 'Data Analysis', icon: Database, color: 'bg-orange-500', description: 'Experimental data' },
    mathematical: { name: 'Mathematical', icon: Gauge, color: 'bg-red-500', description: 'Calculations and formulas' }
  };

  const informationTypes = {
    essential: { name: 'Essential', color: 'border-l-4 border-red-400', description: 'Core physics concepts' },
    contextual: { name: 'Contextual', color: 'border-l-4 border-blue-400', description: 'Historical/practical context' },
    abstract: { name: 'Abstract', color: 'border-l-4 border-purple-400', description: 'Theoretical concepts' },
    supply_chain: { name: 'Applied Physics', color: 'border-l-4 border-green-400', description: 'Technology applications' },
    proofs: { name: 'Formulas/Proofs', color: 'border-l-4 border-orange-400', description: 'Mathematical derivations' }
  };

  // Generate comprehensive JAMB Physics question bank (300 questions)
  const generatePhysicsQuestionBank = () => {
    const questionBank = [];
    
    // JAMB Physics Topics based on official syllabus
    const physicsTopics = [
      'Measurement and Units', 'Scalars and Vectors', 'Motion in One Dimension',
      'Motion in Two Dimensions', 'Force and Motion', 'Work, Energy and Power',
      'Momentum and Impulse', 'Circular Motion', 'Gravitational Field',
      'Simple Harmonic Motion', 'Mechanical Properties of Matter', 'Heat and Temperature',
      'Gas Laws', 'Electric Field and Potential', 'Current Electricity',
      'Magnetism', 'Electromagnetic Induction', 'Alternating Current',
      'Wave Motion', 'Sound Waves', 'Light Waves', 'Optical Instruments',
      'Modern Physics', 'Atomic Structure', 'Nuclear Physics'
    ];

    // Physics question templates based on JAMB style
    const physicsQuestionTemplates = [
      // Mechanics - Mathematical
      {
        template: "Kinematics calculation",
        type: 'mathematical', info: 'essential',
        generator: () => {
          const initialVelocity = Math.floor(Math.random() * 20) + 10; // m/s
          const acceleration = Math.floor(Math.random() * 10) + 2; // m/s²
          const time = Math.floor(Math.random() * 5) + 3; // s
          const finalVelocity = initialVelocity + acceleration * time;
          const distance = initialVelocity * time + 0.5 * acceleration * time * time;
          
          return {
            question: `A car accelerates from ${initialVelocity} m/s at ${acceleration} m/s² for ${time} seconds. Find the final velocity.`,
            options: [
              `${finalVelocity} m/s`,
              `${finalVelocity + 5} m/s`,
              `${initialVelocity + time} m/s`,
              `${acceleration * time} m/s`
            ],
            correct: 0,
            explanation: `Using v = u + at: v = ${initialVelocity} + ${acceleration} × ${time} = ${finalVelocity} m/s`
          };
        }
      },

      // Electricity - Pragmatic
      {
        template: "Electrical circuits",
        type: 'pragmatic', info: 'supply_chain',
        generator: () => {
          const voltage = [6, 9, 12, 24][Math.floor(Math.random() * 4)];
          const current = [0.5, 1, 1.5, 2, 3][Math.floor(Math.random() * 5)];
          const resistance = voltage / current;
          const power = voltage * current;
          
          return {
            question: `A ${voltage}V battery supplies ${current}A to a circuit. Calculate the resistance of the circuit.`,
            options: [
              `${resistance}Ω`,
              `${(resistance * 2).toFixed(1)}Ω`,
              `${(voltage + current).toFixed(1)}Ω`,
              `${(voltage * current).toFixed(1)}Ω`
            ],
            correct: 0,
            explanation: `Using Ohm's law: R = V/I = ${voltage}/${current} = ${resistance}Ω`
          };
        }
      },

      // Waves - Logical
      {
        template: "Wave properties",
        type: 'logical', info: 'abstract',
        generator: () => {
          const frequency = [50, 100, 200, 500, 1000][Math.floor(Math.random() * 5)];
          const wavelength = [0.1, 0.2, 0.3, 0.4, 0.5][Math.floor(Math.random() * 5)];
          const velocity = frequency * wavelength;
          
          return {
            question: `A wave has frequency ${frequency} Hz and wavelength ${wavelength} m. Calculate its velocity.`,
            options: [
              `${velocity} m/s`,
              `${frequency + wavelength} m/s`,
              `${frequency / wavelength} m/s`,
              `${wavelength / frequency} m/s`
            ],
            correct: 0,
            explanation: `Using wave equation: v = fλ = ${frequency} × ${wavelength} = ${velocity} m/s`
          };
        }
      },

      // Heat - Canon
      {
        template: "Temperature conversion",
        type: 'canon', info: 'essential',
        generator: () => {
          const celsius = Math.floor(Math.random() * 100) + 20;
          const kelvin = celsius + 273;
          const fahrenheit = (9/5) * celsius + 32;
          
          return {
            question: `Convert ${celsius}°C to Kelvin.`,
            options: [
              `${kelvin} K`,
              `${celsius} K`,
              `${celsius + 100} K`,
              `${celsius - 273} K`
            ],
            correct: 0,
            explanation: `K = °C + 273 = ${celsius} + 273 = ${kelvin} K`
          };
        }
      },

      // Light - Statistics (experimental data)
      {
        template: "Optics measurement",
        type: 'statistics', info: 'contextual',
        generator: () => {
          const objectDistance = [15, 20, 25, 30][Math.floor(Math.random() * 4)];
          const focalLength = [10, 12, 15][Math.floor(Math.random() * 3)];
          const imageDistance = (objectDistance * focalLength) / (objectDistance - focalLength);
          
          if (imageDistance < 0 || objectDistance <= focalLength) {
            return {
              question: `An object is placed ${objectDistance} cm from a convex lens of focal length ${focalLength} cm. The image formed is:`,
              options: [
                'Virtual and upright',
                'Real and inverted',
                'At infinity',
                'No image formed'
              ],
              correct: 0,
              explanation: `Since object is close to lens (less than 2f), image is virtual and upright`
            };
          }
          
          return {
            question: `An object is ${objectDistance} cm from a lens with focal length ${focalLength} cm. Find the image distance.`,
            options: [
              `${Math.abs(imageDistance).toFixed(1)} cm`,
              `${(objectDistance + focalLength).toFixed(1)} cm`,
              `${(objectDistance - focalLength).toFixed(1)} cm`,
              `${(objectDistance * 2).toFixed(1)} cm`
            ],
            correct: 0,
            explanation: `Using lens formula: 1/f = 1/u + 1/v, so v = ${Math.abs(imageDistance).toFixed(1)} cm`
          };
        }
      },

      // Modern Physics - Abstract
      {
        template: "Atomic physics",
        type: 'logical', info: 'abstract',
        generator: () => {
          const elements = [
            { name: 'Hydrogen', protons: 1, neutrons: 0, electrons: 1 },
            { name: 'Helium', protons: 2, neutrons: 2, electrons: 2 },
            { name: 'Carbon', protons: 6, neutrons: 6, electrons: 6 },
            { name: 'Oxygen', protons: 8, neutrons: 8, electrons: 8 }
          ];
          
          const element = elements[Math.floor(Math.random() * elements.length)];
          const atomicNumber = element.protons;
          const massNumber = element.protons + element.neutrons;
          
          return {
            question: `${element.name} has ${element.protons} protons and ${element.neutrons} neutrons. What is its mass number?`,
            options: [
              `${massNumber}`,
              `${atomicNumber}`,
              `${element.protons}`,
              `${element.neutrons}`
            ],
            correct: 0,
            explanation: `Mass number = protons + neutrons = ${element.protons} + ${element.neutrons} = ${massNumber}`
          };
        }
      },

      // Force and Motion - Mathematical
      {
        template: "Newton's laws",
        type: 'mathematical', info: 'proofs',
        generator: () => {
          const mass = [2, 5, 10, 15, 20][Math.floor(Math.random() * 5)];
          const acceleration = [2, 4, 5, 8, 10][Math.floor(Math.random() * 5)];
          const force = mass * acceleration;
          
          return {
            question: `Calculate the force needed to accelerate a ${mass} kg object at ${acceleration} m/s².`,
            options: [
              `${force} N`,
              `${mass + acceleration} N`,
              `${mass / acceleration} N`,
              `${acceleration - mass} N`
            ],
            correct: 0,
            explanation: `Using F = ma: F = ${mass} × ${acceleration} = ${force} N`
          };
        }
      },

      // Energy - Pragmatic
      {
        template: "Work and energy",
        type: 'pragmatic', info: 'essential',
        generator: () => {
          const mass = [50, 60, 70, 80][Math.floor(Math.random() * 4)];
          const height = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
          const gravity = 10; // simplified for JAMB
          const potentialEnergy = mass * gravity * height;
          
          return {
            question: `A ${mass} kg object is lifted to ${height} m height. Calculate its potential energy. (g = 10 m/s²)`,
            options: [
              `${potentialEnergy} J`,
              `${mass * height} J`,
              `${height * gravity} J`,
              `${mass + height * gravity} J`
            ],
            correct: 0,
            explanation: `PE = mgh = ${mass} × 10 × ${height} = ${potentialEnergy} J`
          };
        }
      }
    ];

    // Generate 300 Physics questions across topics
    physicsTopics.forEach((topic, topicIndex) => {
      const questionsPerTopic = Math.floor(300 / physicsTopics.length);
      const extraQuestions = topicIndex < (300 % physicsTopics.length) ? 1 : 0;
      const totalQuestions = questionsPerTopic + extraQuestions;
      
      for (let i = 0; i < totalQuestions; i++) {
        const template = physicsQuestionTemplates[i % physicsQuestionTemplates.length];
        const generated = template.generator();
        questionBank.push({
          id: `jamb_phy_${(topicIndex * questionsPerTopic + i + 1).toString().padStart(3, '0')}`,
          subject: 'Physics',
          questionType: template.type,
          infoType: template.info,
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
          topic: topic,
          source: 'JAMB Physics Syllabus 2025',
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
    const questionBank = generatePhysicsQuestionBank();
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
    const exportFileDefaultName = `jamb_physics_${new Date().getTime()}.json`;
    
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading JAMB Physics question bank...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Atom className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">JAMB Physics Question Bank</h1>
            <p className="text-gray-600">300 comprehensive physics questions for UTME preparation</p>
          </div>
        </div>
        
        {/* Physics Focus Areas */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">JAMB Physics Priority Topics</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-blue-700">
            <div>• Mechanics (30%)</div>
            <div>• Electricity (25%)</div>
            <div>• Waves & Optics (20%)</div>
            <div>• Modern Physics (15%)</div>
            <div>• Heat & Thermodynamics (10%)</div>
            <div className="font-medium">• Simple calculations emphasized</div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">Total Questions</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.topicCoverage}</div>
            <div className="text-sm text-green-800">Topics Covered</div>
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
              placeholder="Search physics questions, formulas, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
            Physics Questions ({filteredQuestions.length} found)
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
                      <span className="text-gray-600">Physics</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{question.topic}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      Physics
                    </span>
                    <span className={`px-2 py-1 rounded text-xs text-white ${questionTypes[question.questionType].color}`}>
                      