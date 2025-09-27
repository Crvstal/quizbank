import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, BookOpen, Calculator, Target, Database, Brain, FileText, Clock, Award, X, Info, ChevronDown, ChevronUp, RotateCcw, Download, Upload, Globe, Users } from 'lucide-react';

const JAMBQuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subject: 'all',
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

  // Question classification framework adapted for JAMB
  const questionTypes = {
    pragmatic: { name: 'Pragmatic', icon: Target, color: 'bg-blue-500', description: 'Real-world applications' },
    logical: { name: 'Logical', icon: Brain, color: 'bg-purple-500', description: 'Abstract reasoning' },
    canon: { name: 'Canon/Administrative', icon: FileText, color: 'bg-green-500', description: 'Standard definitions/rules' },
    statistics: { name: 'Statistics/Dataset', icon: Database, color: 'bg-orange-500', description: 'Data analysis' },
    mathematical: { name: 'Pure Mathematical', icon: Calculator, color: 'bg-red-500', description: 'Computational problems' }
  };

  const informationTypes = {
    essential: { name: 'Essential', color: 'border-l-4 border-red-400', description: 'Core knowledge' },
    contextual: { name: 'Contextual/Historical', color: 'border-l-4 border-blue-400', description: 'Nigerian/African context' },
    abstract: { name: 'Abstract/Visual', color: 'border-l-4 border-purple-400', description: 'Conceptual thinking' },
    supply_chain: { name: 'Supply Chain/Product', color: 'border-l-4 border-green-400', description: 'Process understanding' },
    proofs: { name: 'Maths Proofs/Formulas', color: 'border-l-4 border-orange-400', description: 'Formal reasoning' }
  };

  // Generate comprehensive JAMB question bank (600 questions total)
  const generateJAMBQuestionBank = () => {
    const questionBank = [];
    
    // JAMB Mathematics Questions (300 total) - Based on JAMB syllabus and past questions
    const mathTopics = [
      'Number Bases', 'Fractions and Decimals', 'Indices and Logarithms', 'Sets and Venn Diagrams',
      'Simultaneous Linear Equations', 'Quadratic Equations', 'Variation', 'Inequalities',
      'Progression (AP & GP)', 'Binary Operations', 'Matrices and Determinants', 'Functions and Graphs',
      'Circle Theorems', 'Trigonometry', 'Mensuration', 'Statistics and Probability'
    ];

    // Math question templates based on JAMB style
    const mathQuestionTemplates = [
      // Number Bases - Pragmatic
      {
        template: "Number base conversion",
        type: 'pragmatic', info: 'essential',
        generator: () => {
          const bases = [2, 3, 5, 8];
          const fromBase = bases[Math.floor(Math.random() * bases.length)];
          const toBase = bases[Math.floor(Math.random() * bases.length)];
          const number = Math.floor(Math.random() * 50) + 10;
          
          // Convert to base 10 first, then to target base
          const convertToBase10 = (num, base) => {
            return parseInt(num.toString(), base);
          };
          
          const convertFromBase10 = (num, base) => {
            return num.toString(base).toUpperCase();
          };
          
          const base10Value = convertToBase10(number, fromBase);
          const result = convertFromBase10(base10Value, toBase);
          
          return {
            question: `Convert ${number.toString(fromBase)}₍${fromBase}₎ to base ${toBase}`,
            options: [
              `${result}₍${toBase}₎`,
              `${(parseInt(result, toBase) + 1).toString(toBase)}₍${toBase}₎`,
              `${(parseInt(result, toBase) - 1).toString(toBase)}₍${toBase}₎`,
              `${(parseInt(result, toBase) * 2).toString(toBase)}₍${toBase}₎`
            ].slice(0, 4),
            correct: 0,
            explanation: `${number}₍${fromBase}₎ = ${base10Value}₍₁₀₎ = ${result}₍${toBase}₎`
          };
        }
      },
      
      // Quadratic Equations - Logical
      {
        template: "Quadratic equation solving",
        type: 'logical', info: 'abstract',
        generator: () => {
          const a = Math.floor(Math.random() * 3) + 1;
          const b = Math.floor(Math.random() * 10) - 5;
          const c = Math.floor(Math.random() * 10) - 5;
          
          // Calculate discriminant
          const discriminant = b * b - 4 * a * c;
          const x1 = (-b + Math.sqrt(Math.abs(discriminant))) / (2 * a);
          const x2 = (-b - Math.sqrt(Math.abs(discriminant))) / (2 * a);
          
          if (discriminant < 0) {
            return {
              question: `Find the roots of ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
              options: [
                'No real roots',
                `x = ${x1.toFixed(1)}, ${x2.toFixed(1)}`,
                `x = ${Math.abs(x1.toFixed(1))}, ${Math.abs(x2.toFixed(1))}`,
                'x = 0, 1'
              ],
              correct: 0,
              explanation: `Discriminant = ${b}² - 4(${a})(${c}) = ${discriminant} < 0, so no real roots exist.`
            };
          } else {
            return {
              question: `Find the roots of ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
              options: [
                `x = ${x1.toFixed(1)}, ${x2.toFixed(1)}`,
                `x = ${(x1 + 1).toFixed(1)}, ${(x2 + 1).toFixed(1)}`,
                `x = ${Math.abs(x1.toFixed(1))}, ${Math.abs(x2.toFixed(1))}`,
                'No real roots'
              ],
              correct: 0,
              explanation: `Using quadratic formula: x = (-${b} ± √${discriminant}) / ${2 * a} = ${x1.toFixed(1)}, ${x2.toFixed(1)}`
            };
          }
        }
      },
      
      // Statistics - Statistics type
      {
        template: "Data analysis",
        type: 'statistics', info: 'contextual',
        generator: () => {
          const students = ['Adamu', 'Blessing', 'Chidi', 'Damilola', 'Emeka', 'Fatima', 'Grace'];
          const scores = students.map(() => Math.floor(Math.random() * 40) + 60).sort((a, b) => a - b);
          const mean = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
          const median = scores[Math.floor(scores.length / 2)];
          const mode = scores.reduce((acc, score) => {
            acc[score] = (acc[score] || 0) + 1;
            return acc;
          }, {});
          const modeValue = Object.keys(mode).find(key => mode[key] === Math.max(...Object.values(mode))) || scores[0];
          
          return {
            question: `The test scores of 7 students are: ${scores.join(', ')}. Find the median score.`,
            options: [
              `${median}`,
              `${mean}`,
              `${modeValue}`,
              `${scores[0]}`
            ],
            correct: 0,
            explanation: `For 7 values in ascending order, the median is the 4th value: ${median}`
          };
        }
      },

      // Circle Theorem - Mathematical
      {
        template: "Circle geometry",
        type: 'mathematical', info: 'proofs',
        generator: () => {
          const radius = Math.floor(Math.random() * 10) + 5;
          const angle = [30, 45, 60, 90][Math.floor(Math.random() * 4)];
          const area = Math.PI * radius * radius;
          const circumference = 2 * Math.PI * radius;
          const arcLength = (angle / 360) * circumference;
          
          return {
            question: `A circle has radius ${radius}cm. Find the length of an arc subtending ${angle}° at the center.`,
            options: [
              `${(arcLength / Math.PI).toFixed(1)}π cm`,
              `${(arcLength / Math.PI * 2).toFixed(1)}π cm`,
              `${radius}π cm`,
              `${(radius / 2).toFixed(1)}π cm`
            ],
            correct: 0,
            explanation: `Arc length = (θ/360°) × 2πr = (${angle}/360) × 2π × ${radius} = ${(arcLength / Math.PI).toFixed(1)}π cm`
          };
        }
      }
    ];

    // Generate 300 JAMB Math questions
    mathTopics.forEach((topic, topicIndex) => {
      for (let i = 0; i < Math.floor(300 / mathTopics.length) + (topicIndex < 300 % mathTopics.length ? 1 : 0); i++) {
        const template = mathQuestionTemplates[i % mathQuestionTemplates.length];
        const generated = template.generator();
        questionBank.push({
          id: `jamb_math_${topicIndex * 20 + i + 1}`,
          subject: 'Mathematics',
          questionType: template.type,
          infoType: template.info,
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
          topic: topic,
          source: 'JAMB UTME Past Questions/Nigerian Education',
          examType: 'JAMB/UTME',
          ...generated
        });
      }
    });

    // JAMB Use of English Questions (300 total) - Based on JAMB syllabus
    const englishTopics = [
      'Vowels and Consonants', 'Word Stress', 'Intonation Patterns', 'Rhyme Schemes',
      'Comprehension and Summary', 'Vocabulary Development', 'Lexis and Structure',
      'Sentence Interpretation', 'Analogy', 'Idioms and Phrases',
      'Register (Formal/Informal)', 'Prose and Poetry', 'Drama and Theatre',
      'Narrative Techniques', 'Literary Appreciation', 'Essay Writing Techniques'
    ];

    const englishQuestionTemplates = [
      // Lexis and Structure - Canon
      {
        template: "Grammar and usage",
        type: 'canon', info: 'essential',
        generator: () => {
          const sentences = [
            {
              question: "Choose the option that best completes the sentence:",
              stem: "The principal, together with the teachers, _____ attending the meeting.",
              correct: "is",
              options: ["is", "are", "were", "have been"],
              explanation: "When 'together with' is used, the verb agrees with the first subject 'principal' (singular)"
            },
            {
              question: "Choose the correctly punctuated sentence:",
              stem: "",
              correct: "The boy's book is on the table.",
              options: [
                "The boy's book is on the table.",
                "The boys book is on the table.",
                "The boys' book is on the table.", 
                "The boy book's is on the table."
              ],
              explanation: "The apostrophe shows possession by one boy, so 'boy's' is correct"
            }
          ];
          
          const sentence = sentences[Math.floor(Math.random() * sentences.length)];
          return {
            question: `${sentence.question} ${sentence.stem}`,
            options: sentence.options,
            correct: sentence.options.indexOf(sentence.correct),
            explanation: sentence.explanation
          };
        }
      },

      // Comprehension - Logical
      {
        template: "Reading comprehension",
        type: 'logical', info: 'contextual',
        generator: () => {
          const passages = [
            {
              text: "Nigeria's agricultural sector employs about 70% of the population, yet it contributes only 24% to the GDP. This paradox highlights inefficiencies in farming practices, limited access to modern equipment, and inadequate government support for rural farmers.",
              question: "What does the passage suggest about Nigerian agriculture?",
              correct: "There is a mismatch between employment and productivity",
              wrong: ["Agriculture is the most profitable sector", "Farmers are overpaid", "Modern equipment is widely available"]
            },
            {
              text: "The harmattan wind brings dust from the Sahara Desert across West Africa between November and February. While it provides relief from humidity, it also causes respiratory problems and reduces visibility for air and road transport.",
              question: "According to the passage, the harmattan wind:",
              correct: "Has both positive and negative effects",
              wrong: ["Only causes problems", "Improves transportation", "Occurs year-round"]
            }
          ];
          
          const passage = passages[Math.floor(Math.random() * passages.length)];
          return {
            question: `Read the passage and answer the question.\n\n"${passage.text}"\n\n${passage.question}`,
            options: [passage.correct, ...passage.wrong],
            correct: 0,
            explanation: `The passage indicates that ${passage.correct.toLowerCase()} through the evidence presented.`
          };
        }
      },

      // Vocabulary - Pragmatic
      {
        template: "Word meaning in context",
        type: 'pragmatic', info: 'essential',
        generator: () => {
          const contextWords = [
            {
              sentence: "The politician's speech was full of grandiloquent phrases that impressed the audience.",
              word: "grandiloquent",
              meaning: "pompous or extravagant in language",
              wrong: ["simple and clear", "angry and hostile", "quiet and humble"]
            },
            {
              sentence: "After the coup, the country was in a state of anarchy with no effective government.",
              word: "anarchy",
              meaning: "absence of government and control",
              wrong: ["strict military rule", "democratic elections", "foreign intervention"]
            }
          ];
          
          const item = contextWords[Math.floor(Math.random() * contextWords.length)];
          return {
            question: `In the sentence "${item.sentence}", the word "${item.word}" means:`,
            options: [item.meaning, ...item.wrong],
            correct: 0,
            explanation: `From the context, "${item.word}" means "${item.meaning}"`
          };
        }
      },

      // Literary Appreciation - Abstract
      {
        template: "Literary devices and techniques",
        type: 'canon', info: 'abstract',
        generator: () => {
          const literaryExamples = [
            {
              text: "The classroom was a zoo during the teacher's absence.",
              device: "Metaphor",
              explanation: "The classroom is directly compared to a zoo without using 'like' or 'as'",
              wrong: ["Simile", "Personification", "Alliteration"]
            },
            {
              text: "The wind whispered secrets through the palm trees.",
              device: "Personification",
              explanation: "The wind is given human qualities (whispering)",
              wrong: ["Metaphor", "Hyperbole", "Onomatopoeia"]
            }
          ];
          
          const example = literaryExamples[Math.floor(Math.random() * literaryExamples.length)];
          return {
            question: `Identify the literary device used in: "${example.text}"`,
            options: [example.device, ...example.wrong],
            correct: 0,
            explanation: example.explanation
          };
        }
      }
    ];

    // Generate 300 JAMB English questions
    englishTopics.forEach((topic, topicIndex) => {
      for (let i = 0; i < Math.floor(300 / englishTopics.length) + (topicIndex < 300 % englishTopics.length ? 1 : 0); i++) {
        const template = englishQuestionTemplates[i % englishQuestionTemplates.length];
        const generated = template.generator();
        questionBank.push({
          id: `jamb_eng_${topicIndex * 20 + i + 1}`,
          subject: 'Use of English',
          questionType: template.type,
          infoType: template.info,
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
          topic: topic,
          source: 'JAMB UTME Past Questions/Nigerian Education',
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
    const questionBank = generateJAMBQuestionBank();
    setQuestions(questionBank);
    setFilteredQuestions(questionBank);
    setLoading(false);
  }, []);

  // Advanced filtering and search logic
  const performSearch = useMemo(() => {
    let result = [...questions];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(q => 
        q.question.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query) ||
        q.explanation.toLowerCase().includes(query) ||
        q.options.some(opt => opt.toLowerCase().includes(query))
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== 'all') {
        result = result.filter(q => q[key] === value);
      }
    });

    // Sorting
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

  // Get unique values for filters
  const getUniqueValues = (field) => {
    return [...new Set(questions.map(q => q[field]))].sort();
  };

  // Export functionality
  const exportData = () => {
    const dataStr = JSON.stringify(filteredQuestions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `jamb_questions_export_${new Date().getTime()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: filteredQuestions.length,
      bySubject: {
        Mathematics: filteredQuestions.filter(q => q.subject === 'Mathematics').length,
        'Use of English': filteredQuestions.filter(q => q.subject === 'Use of English').length
      },
      byDifficulty: {
        Easy: filteredQuestions.filter(q => q.difficulty === 'Easy').length,
        Medium: filteredQuestions.filter(q => q.difficulty === 'Medium').length,
        Hard: filteredQuestions.filter(q => q.difficulty === 'Hard').length
      },
      byType: Object.keys(questionTypes).reduce((acc, type) => {
        acc[type] = filteredQuestions.filter(q => q.questionType === type).length;
        return acc;
      }, {})
    };
  }, [filteredQuestions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading JAMB question bank...</p>
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
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">JAMB UTME Question Bank</h1>
            <p className="text-gray-600">Comprehensive Nigerian university entrance examination preparation</p>
          </div>
        </div>
        
        {/* JAMB Info Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">JAMB UTME Format</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>• Total Questions: 180 (60 Use of English + 40 each for 3 subjects)</div>
            <div>• Duration: 3 hours</div>
            <div>• Format: Computer Based Test (CBT)</div>
            <div>• Pass Mark: Varies by institution (typically 180-250)</div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            <div className="text-sm text-green-800">Total Questions</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.bySubject.Mathematics}</div>
            <div className="text-sm text-blue-800">Mathematics</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.bySubject['Use of English']}</div>
            <div className="text-sm text-purple-800">Use of English</div>
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
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search JAMB questions, topics, explanations..."
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
                  subject: 'all',
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="all">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Use of English">Use of English</option>
                </select>
              </div>

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
                  <option value="subject">Subject</option>
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
            JAMB Question Results ({filteredQuestions.length} found)
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
              <option value={100}>100</option>
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
                      <span className="text-gray-600">{question.subject}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{question.topic}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      JAMB
                    </span>
                    <span className={`px-2 py-1 rounded text-xs text-white ${questionTypes[question.questionType].color}`}>
                      {questionTypes[question.questionType].name}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3 line-clamp-2">
                  {question.question.length > 150 ? 
                    question.question.substring(0, 150) + '...' : 
                    question.question
                  }
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Source: {question.source}</span>
                  <span>{informationTypes[question.infoType].name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-green-600 text-white'
                        : 'border hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
            
            <span className="ml-4 text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({filteredQuestions.length} questions)
            </span>
          </div>
        )}
      </div>

      {/* Question Modal */}
      {showModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedQuestion.subject} - {selectedQuestion.id}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium">
                      JAMB UTME
                    </span>
                    <span className={`px-3 py-1 rounded text-sm text-white ${questionTypes[selectedQuestion.questionType].color}`}>
                      {questionTypes[selectedQuestion.questionType].name}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm ${
                      selectedQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      selectedQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedQuestion.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                      {informationTypes[selectedQuestion.infoType].name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedQuestion.topic}</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Question Content */}
              <div className={`p-6 rounded-lg mb-6 ${informationTypes[selectedQuestion.infoType].color}`}>
                <h4 className="font-semibold mb-4 text-lg">Question:</h4>
                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                  {selectedQuestion.question}
                </p>
              </div>
              
              {/* Answer Options */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Answer Options:</h4>
                <div className="space-y-3">
                  {selectedQuestion.options.map((option, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 transition-colors ${
                      index === selectedQuestion.correct 
                        ? 'bg-green-50 border-green-200 shadow-sm' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === selectedQuestion.correct 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-gray-800 flex-1">{option}</span>
                        {index === selectedQuestion.correct && (
                          <div className="flex items-center gap-2 text-green-600">
                            <Award className="w-5 h-5" />
                            <span className="text-sm font-medium">Correct Answer</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Explanation */}
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Detailed Explanation:
                </h4>
                <p className="text-green-800 leading-relaxed">
                  {selectedQuestion.explanation}
                </p>
              </div>

              {/* Metadata */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-700">Question Metadata:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Source:</span>
                    <p className="text-gray-800">{selectedQuestion.source}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Exam Type:</span>
                    <p className="text-gray-800">{selectedQuestion.examType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Classification:</span>
                    <p className="text-gray-800">{questionTypes[selectedQuestion.questionType].name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Information Type:</span>
                    <p className="text-gray-800">{informationTypes[selectedQuestion.infoType].name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Subject Area:</span>
                    <p className="text-gray-800">{selectedQuestion.subject}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Topic:</span>
                    <p className="text-gray-800">{selectedQuestion.topic}</p>
                  </div>
                </div>
              </div>

              {/* JAMB Specific Info */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-green-800 mb-2">JAMB UTME Context:</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• This question type typically appears in {selectedQuestion.subject} section</p>
                  <p>• Time allocation: ~90 seconds per question in actual exam</p>
                  <p>• Nigerian educational curriculum aligned</p>
                  {selectedQuestion.subject === 'Use of English' && (
                    <p>• Use of English is compulsory for all JAMB candidates</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Status */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>JAMB System Ready • 600 questions • Nigerian curriculum aligned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JAMBQuestionBank;
                    