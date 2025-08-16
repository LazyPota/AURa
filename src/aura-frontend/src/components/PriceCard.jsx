import React from 'react';
import { FaArrowUp, FaArrowDown, FaCoins } from 'react-icons/fa';

const PriceCard = ({ price, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
          ICP Price
        </h3>
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!price) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
          ICP Price
        </h3>
        <div className="text-center text-slate-500 dark:text-slate-400">
          No price data available
        </div>
      </div>
    );
  }

  const currentPrice = price.price || 0;
  const change24h = price.change24h || 0;
  const isPositive = change24h >= 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price);
  };

  const formatPercentage = (percentage) => {
    return `${isPositive ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          ICP Price
        </h3>
        <div className="flex items-center gap-2">
          <FaCoins className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Internet Computer
          </span>
        </div>
      </div>

      {/* Current Price */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {formatPrice(currentPrice)}
        </div>
        
        {/* 24h Change */}
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPositive 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          {isPositive ? (
            <FaArrowUp className="text-xs" />
          ) : (
            <FaArrowDown className="text-xs" />
          )}
          {formatPercentage(change24h)}
          <span className="text-xs opacity-75">24h</span>
        </div>
      </div>

      {/* Price Chart Visualization (Simple) */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span>24h Performance</span>
          <span>{isPositive ? 'Gaining' : 'Declining'}</span>
        </div>
        
        <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
              isPositive ? 'bg-green-400' : 'bg-red-400'
            }`}
            style={{ 
              width: `${Math.min(100, Math.abs(change24h) * 10)}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Market Cap Rank
          </div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            #27
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Volume (24h)
          </div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            High
          </div>
        </div>
      </div>

      {price.timestamp && (
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
          Last updated: {new Date(Number(price.timestamp) / 1000000).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default PriceCard;