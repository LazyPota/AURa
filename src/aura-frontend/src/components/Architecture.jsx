import React, { useState } from 'react';
import { 
  FaServer, 
  FaCloud, 
  FaDatabase, 
  FaRobot, 
  FaChartLine, 
  FaNewspaper,
  FaExchangeAlt,
  FaShieldAlt,
  FaClock,
  FaInfoCircle
} from 'react-icons/fa';

const Architecture = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const components = [
    {
      id: 'frontend',
      name: 'React Frontend',
      icon: <FaCloud className="text-blue-500" />,
      description: 'User interface deployed as ICP canister',
      details: [
        'Real-time dashboard updates',
        'Responsive design for all devices',
        'Dark/light theme support',
        'Professional UI components'
      ],
      position: { top: '10%', left: '10%' }
    },
    {
      id: 'backend',
      name: 'Motoko Backend',
      icon: <FaServer className="text-green-500" />,
      description: 'Core logic running 100% on-chain',
      details: [
        'Autonomous operation with timers',
        'HTTP outcalls for external data',
        'Secure API key management',
        'Comprehensive error handling'
      ],
      position: { top: '10%', right: '10%' }
    },
    {
      id: 'sentiment',
      name: 'Sentiment Engine',
      icon: <FaRobot className="text-purple-500" />,
      description: 'AI-powered sentiment analysis',
      details: [
        'Keyword-based analysis',
        'Confidence scoring',
        'Real-time processing',
        'Bullish/Bearish/Neutral classification'
      ],
      position: { top: '40%', left: '20%' }
    },
    {
      id: 'price',
      name: 'Price Oracle',
      icon: <FaChartLine className="text-orange-500" />,
      description: 'CoinGecko API integration',
      details: [
        'Real-time ICP price data',
        '24h change tracking',
        'Market cap information',
        'Retry logic with backoff'
      ],
      position: { top: '40%', right: '20%' }
    },
    {
      id: 'news',
      name: 'News Aggregator',
      icon: <FaNewspaper className="text-red-500" />,
      description: 'NewsAPI integration for market news',
      details: [
        'Cryptocurrency news filtering',
        'Text extraction and processing',
        'Multiple source aggregation',
        'Rate limiting protection'
      ],
      position: { bottom: '30%', left: '15%' }
    },
    {
      id: 'storage',
      name: 'Stable Memory',
      icon: <FaDatabase className="text-indigo-500" />,
      description: 'Persistent data storage',
      details: [
        'Upgrade-safe data persistence',
        'Log rotation management',
        'State recovery mechanisms',
        'Efficient memory usage'
      ],
      position: { bottom: '30%', right: '15%' }
    },
    {
      id: 'security',
      name: 'Security Layer',
      icon: <FaShieldAlt className="text-yellow-500" />,
      description: 'Authentication and authorization',
      details: [
        'Caller verification',
        'API key encryption',
        'Input sanitization',
        'Rate limiting protection'
      ],
      position: { bottom: '10%', left: '25%' }
    },
    {
      id: 'automation',
      name: 'Automation Engine',
      icon: <FaClock className="text-teal-500" />,
      description: '5-minute automated cycles',
      details: [
        'Timer-based execution',
        'Failure recovery',
        'Health monitoring',
        'Performance metrics'
      ],
      position: { bottom: '10%', right: '25%' }
    }
  ];

  const connections = [
    { from: 'frontend', to: 'backend', type: 'bidirectional' },
    { from: 'backend', to: 'sentiment', type: 'unidirectional' },
    { from: 'backend', to: 'price', type: 'unidirectional' },
    { from: 'backend', to: 'news', type: 'unidirectional' },
    { from: 'backend', to: 'storage', type: 'bidirectional' },
    { from: 'backend', to: 'security', type: 'bidirectional' },
    { from: 'backend', to: 'automation', type: 'bidirectional' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          System Architecture
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <FaInfoCircle />
          Click components for details
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="relative h-96 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 mb-6 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Components */}
        {components.map((component) => (
          <div
            key={component.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              selectedComponent?.id === component.id 
                ? 'scale-110 z-20' 
                : 'hover:scale-105 z-10'
            }`}
            style={component.position}
            onClick={() => setSelectedComponent(
              selectedComponent?.id === component.id ? null : component
            )}
          >
            <div className={`bg-white dark:bg-slate-700 rounded-lg shadow-lg p-3 border-2 transition-all duration-300 ${
              selectedComponent?.id === component.id 
                ? 'border-blue-500 shadow-xl' 
                : 'border-slate-200 dark:border-slate-600 hover:border-blue-300'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xl">{component.icon}</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {component.name}
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 max-w-32">
                {component.description}
              </div>
            </div>
          </div>
        ))}

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
          {connections.map((connection, index) => {
            const fromComponent = components.find(c => c.id === connection.from);
            const toComponent = components.find(c => c.id === connection.to);
            
            if (!fromComponent || !toComponent) return null;

            // Calculate positions (simplified)
            const fromX = fromComponent.position.left ? 
              parseFloat(fromComponent.position.left) : 
              100 - parseFloat(fromComponent.position.right);
            const fromY = fromComponent.position.top ? 
              parseFloat(fromComponent.position.top) : 
              100 - parseFloat(fromComponent.position.bottom);
            
            const toX = toComponent.position.left ? 
              parseFloat(toComponent.position.left) : 
              100 - parseFloat(toComponent.position.right);
            const toY = toComponent.position.top ? 
              parseFloat(toComponent.position.top) : 
              100 - parseFloat(toComponent.position.bottom);

            return (
              <line
                key={index}
                x1={`${fromX}%`}
                y1={`${fromY}%`}
                x2={`${toX}%`}
                y2={`${toY}%`}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={connection.type === 'bidirectional' ? '0' : '5,5'}
                className="text-slate-400 dark:text-slate-500 opacity-60"
              />
            );
          })}
        </svg>
      </div>

      {/* Component Details */}
      {selectedComponent && (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">{selectedComponent.icon}</div>
            <div>
              <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                {selectedComponent.name}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {selectedComponent.description}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedComponent.details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                {detail}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-slate-400"></div>
          <span>Bidirectional</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-slate-400" style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 2px, currentColor 2px, currentColor 4px)' }}></div>
          <span>Unidirectional</span>
        </div>
      </div>
    </div>
  );
};

export default Architecture;