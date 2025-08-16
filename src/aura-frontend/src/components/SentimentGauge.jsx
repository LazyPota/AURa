import React from 'react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const SentimentGauge = ({ sentiment, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
          Market Sentiment
        </h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!sentiment) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
          Market Sentiment
        </h3>
        <div className="text-center text-slate-500 dark:text-slate-400">
          No sentiment data available
        </div>
      </div>
    );
  }

  const score = sentiment.score || 0;
  const confidence = sentiment.confidence || 0;
  const keywords = sentiment.keywords || [];

  // Determine sentiment category and colors
  const getSentimentInfo = (score) => {
    if (score > 20) {
      return {
        label: 'Bullish',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        icon: <FaArrowUp className="text-green-600 dark:text-green-400" />,
        emoji: '🚀'
      };
    } else if (score < -20) {
      return {
        label: 'Bearish',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        icon: <FaArrowDown className="text-red-600 dark:text-red-400" />,
        emoji: '🐻'
      };
    } else {
      return {
        label: 'Neutral',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        icon: <FaMinus className="text-yellow-600 dark:text-yellow-400" />,
        emoji: '⚖️'
      };
    }
  };

  const sentimentInfo = getSentimentInfo(score);

  // Calculate gauge position (0-100%)
  const gaugePosition = Math.max(0, Math.min(100, (score + 100) / 2));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          Market Sentiment
        </h3>
        <div className="flex items-center gap-2">
          {sentimentInfo.icon}
          <span className="text-2xl">{sentimentInfo.emoji}</span>
        </div>
      </div>

      {/* Sentiment Score Display */}
      <div className="text-center mb-6">
        <div className={`text-3xl font-bold ${sentimentInfo.color} mb-2`}>
          {score > 0 ? '+' : ''}{score}
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${sentimentInfo.bgColor} ${sentimentInfo.color}`}>
          {sentimentInfo.label}
        </div>
      </div>

      {/* Gauge Visualization */}
      <div className="mb-6">
        <div className="relative h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
          
          {/* Indicator */}
          <div 
            className="absolute top-0 h-full w-1 bg-slate-800 dark:bg-white shadow-lg transition-all duration-500"
            style={{ left: `${gaugePosition}%` }}
          ></div>
        </div>
        
        {/* Scale labels */}
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>Bearish</span>
          <span>Neutral</span>
          <span>Bullish</span>
        </div>
      </div>

      {/* Confidence and Keywords */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600 dark:text-slate-300">Confidence:</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {Math.round(confidence * 100)}%
            </span>
          </div>
        </div>

        {keywords.length > 0 && (
          <div>
            <span className="text-sm text-slate-600 dark:text-slate-300 block mb-2">
              Key Indicators:
            </span>
            <div className="flex flex-wrap gap-1">
              {keywords.slice(0, 6).map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {keyword}
                </span>
              ))}
              {keywords.length > 6 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  +{keywords.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {sentiment.timestamp && (
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2 border-t border-slate-200 dark:border-slate-700">
            Last updated: {new Date(Number(sentiment.timestamp) / 1000000).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentGauge;