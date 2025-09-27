import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Calculator, Target, Database, Brain, FileText, Clock, Award, X, Info, AlertCircle, CheckCircle } from 'lucide-react';

const SATQuestionTaxonomy = () => {
  const [activeView, setActiveView] = useState('individual');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [currentPath, setCurrentPath] = useState(['Home', 'SAT Prep']);

  // Question Classification Framework
  const questionTypes = {
    pragmatic: { name: 'Pragmatic', icon: Target, color: 'bg-blue-500' },
    logical: { name: 'Logical', icon: Brain, color: 'bg-purple-500' },
    canon: { name: 'Canon/Administrative', icon: FileText, color: 'bg-green-500' },
    statistics: { name: 'Statistics/Dataset', icon: Database, color: 'bg-orange-500' },
    mathematical: { name: 'Pure Mathematical', icon: Calculator, color: 'bg-red-500' }
  };

  const informationTypes = {
    essential: { name: 'Essential', color: 'border-l-4 border-red-400' },
    contextual: { name: 'Contextual/Historical', color: 'border-l-4 border-blue-400' },
    abstract: { name: 'Abstract/Visual', color: 'border-l-4 border-purple-400' },
    supply_chain: { name: 'Supply Chain/Product', color: 'border-l-4 border-green-400' },
    proofs: { name: 'Maths Proofs/Formulas', color: 'border-l-4 border-orange-400' }
  };

  // SAT Math Questions
  const mathQuestions = [
    {
      id: 'math_1',
      subject: 'Math',
      questionType: 'pragmatic',
      infoType: 'essential',
      question: 'A car rental company charges $30 per day plus $0.25 per mile. If Sarah rented a car for 3 days and drove 240 miles, how much did she pay in total?',
      options: ['$102', '$150', '$90', '$162'],
      correct: 0,
      explanation: 'Daily cost: 3 × $30 = $90. Mileage cost: 240 × $0.25 = $60. Total: $90 + $60 = $150',
      difficulty: 'Medium',
      topic: 'Linear Functions & Applications'
    },
    {
      id: 'math_2',
      subject: 'Math',
      questionType: 'logical',
      infoType: 'abstract',
      question: 'If f(x) = 2x² - 3x + 1, what is the value of f(-2)?',
      options: ['15', '11', '7', '3'],
      correct: 0,
      explanation: 'f(-2) = 2(-2)² - 3(-2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15',
      difficulty: 'Medium',
      topic: 'Quadratic Functions'
    },
    {
      id: 'math_3',
      subject: 'Math',
      questionType: 'statistics',
      infoType: 'contextual',
      question: 'The scores on a test were: 78, 82, 85, 88, 90, 92, 95. What is the median score?',
      options: ['85', '88', '87', '90'],
      correct: 1,
      explanation: 'With 7 values, the median is the 4th value when arranged in order: 88',
      difficulty: 'Easy',
      topic: 'Statistics & Data Analysis'
    },
    {
      id: 'math_4',
      subject: 'Math',
      questionType: 'mathematical',
      infoType: 'proofs',
      question: 'Solve for x: 3x² - 12x + 9 = 0',
      options: ['x = 1 or x = 3', 'x = 3 only', 'x = 1 only', 'x = -1 or x = -3'],
      correct: 1,
      explanation: '3x² - 12x + 9 = 0 → 3(x² - 4x + 3) = 0 → 3(x-1)(x-3) = 0. But checking: only x = 3 satisfies the original equation.',
      difficulty: 'Hard',
      topic: 'Quadratic Equations'
    },
    {
      id: 'math_5',
      subject: 'Math',
      questionType: 'canon',
      infoType: 'essential',
      question: 'What is the standard form of a quadratic function?',
      options: ['y = mx + b', 'y = ax² + bx + c', 'y = a(x-h)² + k', 'y = ab^x'],
      correct: 1,
      explanation: 'The standard form of a quadratic function is y = ax² + bx + c, where a ≠ 0',
      difficulty: 'Easy',
      topic: 'Quadratic Functions - Definitions'
    }
  ];

  // SAT English Questions
  const englishQuestions = [
    {
      id: 'eng_1',
      subject: 'English',
      questionType: 'pragmatic',
      infoType: 'essential',
      question: 'Which sentence uses parallel structure correctly?',
      options: [
        'She likes reading, writing, and to swim.',
        'She likes reading, writing, and swimming.',
        'She likes to read, writing, and swimming.',
        'She likes reading, to write, and swimming.'
      ],
      correct: 1,
      explanation: 'Parallel structure requires consistent grammatical forms: "reading, writing, and swimming" (all gerunds)',
      difficulty: 'Medium',
      topic: 'Grammar & Usage'
    },
    {
      id: 'eng_2',
      subject: 'English',
      questionType: 'logical',
      infoType: 'contextual',
      question: 'Based on the passage context, what does the author imply about climate change adaptation?',
      passage: 'While mitigation efforts focus on reducing greenhouse gas emissions, adaptation strategies prepare communities for inevitable climate impacts. Cities investing in flood barriers and drought-resistant infrastructure demonstrate forward-thinking leadership.',
      options: [
        'Adaptation is more important than mitigation',
        'Some climate impacts are unavoidable',
        'Cities are not prepared for climate change',
        'Infrastructure investment is wasteful'
      ],
      correct: 1,
      explanation: 'The phrase "inevitable climate impacts" directly implies that some effects cannot be prevented',
      difficulty: 'Medium',
      topic: 'Reading Comprehension'
    },
    {
      id: 'eng_3',
      subject: 'English',
      questionType: 'canon',
      infoType: 'abstract',
      question: 'What literary device is used in: "The wind whispered secrets through the trees"?',
      options: ['Metaphor', 'Simile', 'Personification', 'Alliteration'],
      correct: 2,
      explanation: 'Personification gives human characteristics (whispering) to non-human things (wind)',
      difficulty: 'Easy',
      topic: 'Literary Devices'
    },
    {
      id: 'eng_4',
      subject: 'English',
      questionType: 'statistics',
      infoType: 'supply_chain',
      question: 'Which graph would best support an argument about the economic impact of renewable energy?',
      options: [
        'A pie chart showing energy sources',
        'A line graph showing job creation over time',
        'A bar chart comparing countries',
        'A flowchart of energy production'
      ],
      correct: 1,
      explanation: 'Economic impact over time is best shown with a line graph displaying trends in job creation',
      difficulty: 'Medium',
      topic: 'Data Analysis & Evidence'
    },
    {
      id: 'eng_5',
      subject: 'English',
      questionType: 'mathematical',
      infoType: 'proofs',
      question: 'Which transition word best shows cause and effect?',
      options: ['However', 'Therefore', 'Meanwhile', 'Similarly'],
      correct: 1,
      explanation: '"Therefore" explicitly indicates that what follows is a result of what came before',
      difficulty: 'Easy',
      topic: 'Writing & Language - Transitions'
    }
  ];

  const allQuestions = [...mathQuestions, ...englishQuestions];

  // Matrix data for cross-tabulation
  const getMatrixData = () => {
    const matrix = {};
    Object.keys(questionTypes).forEach(qType => {
      matrix[qType] = {};
      Object.keys(informationTypes).forEach(iType => {
        matrix[qType][iType] = allQuestions.filter(q => 
          q.questionType === qType && q.infoType === iType
        );
      });
    });
    return matrix;
  };

  const Breadcrumbs = ({ path }) => (
    <nav className="flex mb-6 text-sm">
      {path.map((item, index) => (
        <span key={index} className="flex items-center">
          <span className={index === path.length - 1 ? "text-blue-600 font-medium" : "text-gray-500"}>
            {item}
          </span>
          {index < path.length - 1 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
        </span>
      ))}
    </nav>
  );

  const Tooltip = ({ content, isVisible }) => (
    isVisible && (
      <div className="absolute z-50 px-3 py-2 text-sm bg-gray-800 text-white rounded-lg shadow-lg max-w-xs -top-2 left-full ml-2">
        {content}
        <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-800 transform rotate-45"></div>
      </div>
    )
  );

  const QuestionModal = ({ question, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">{question.subject} Question</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded text-xs text-white ${questionTypes[question.questionType].color}`}>
                  {questionTypes[question.questionType].name}
                </span>
                <span className="text-sm text-gray-600">{question.difficulty}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className={`p-4 rounded-lg mb-4 ${informationTypes[question.infoType].color}`}>
            <p className="font-medium mb-2">{question.question}</p>
            {question.passage && (
              <div className="bg-gray-50 p-3 rounded text-sm mb-3">
                <em>{question.passage}</em>
              </div>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            {question.options.map((option, index) => (
              <div key={index} className={`p-3 rounded border ${
                index === question.correct ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                {index === question.correct && <CheckCircle className="inline w-4 h-4 ml-2 text-green-600" />}
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Breadcrumbs path={currentPath} />
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">SAT Question Taxonomy & Quiz Prep System</h1>
        <p className="text-gray-600 mb-6">Comprehensive question classification for Math and English SAT preparation</p>
        
        {/* Navigation */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveView('individual')}
            className={`pb-2 px-1 border-b-2 font-medium ${
              activeView === 'individual' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Individual Questions
          </button>
          <button
            onClick={() => setActiveView('matrix')}
            className={`pb-2 px-1 border-b-2 font-medium ${
              activeView === 'matrix' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Matrix View
          </button>
        </div>

        {/* Individual Questions View */}
        {activeView === 'individual' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Individual Question Classification</h2>
            
            {/* Subject Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Math: {mathQuestions.length} questions</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span className="font-medium">English: {englishQuestions.length} questions</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allQuestions.map((question) => {
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
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <QuestionIcon className="w-4 h-4" />
                        <span className="font-medium text-sm">{question.subject}</span>
                      </div>
                      <div 
                        className="relative"
                        onMouseEnter={() => setTooltipVisible(question.id)}
                        onMouseLeave={() => setTooltipVisible(null)}
                      >
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        <Tooltip 
                          content={`${questionTypes[question.questionType].name} × ${informationTypes[question.infoType].name}`}
                          isVisible={tooltipVisible === question.id}
                        />
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                      {question.question.substring(0, 120)}...
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-xs text-white ${questionTypes[question.questionType].color}`}>
                        {questionTypes[question.questionType].name}
                      </span>
                      <span className="text-xs text-gray-500">{question.difficulty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Matrix View */}
        {activeView === 'matrix' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Question Type × Information Type Matrix</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-3 bg-gray-100 text-left font-medium">Question Type ↓ / Info Type →</th>
                    {Object.entries(informationTypes).map(([key, info]) => (
                      <th key={key} className="border p-3 bg-gray-100 text-center font-medium min-w-32">
                        {info.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(questionTypes).map(([qType, qInfo]) => (
                    <tr key={qType}>
                      <td className={`border p-3 font-medium text-white ${qInfo.color}`}>
                        <div className="flex items-center gap-2">
                          <qInfo.icon className="w-4 h-4" />
                          {qInfo.name}
                        </div>
                      </td>
                      {Object.entries(informationTypes).map(([iType, iInfo]) => {
                        const questions = getMatrixData()[qType][iType];
                        return (
                          <td key={iType} className="border p-3 text-center">
                            {questions.length > 0 ? (
                              <div className="space-y-1">
                                <span className="font-bold text-lg text-blue-600">{questions.length}</span>
                                <div className="text-xs text-gray-600">
                                  {questions.map(q => q.subject).join(', ')}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">0</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Matrix Insights</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Total Questions: {allQuestions.length}</li>
                <li>• Most Common Type: {Object.entries(
                  allQuestions.reduce((acc, q) => {
                    acc[q.questionType] = (acc[q.questionType] || 0) + 1;
                    return acc;
                  }, {})
                ).sort(([,a], [,b]) => b - a)[0]?.[0]} questions</li>
                <li>• Coverage: {Object.keys(questionTypes).length} question types × {Object.keys(informationTypes).length} information types</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedQuestion && (
        <QuestionModal 
          question={selectedQuestion} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {/* Error Management Notification */}
      <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">System ready for GitHub Pages deployment</span>
        </div>
      </div>
    </div>
  );
};

export default SATQuestionTaxonomy;