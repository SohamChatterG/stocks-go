import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../api/axios';
import { StockPrice } from '../types';

interface PriceUpdate {
    type: string;
    prices: StockPrice[];
}

interface LivePricesTableProps {
    onStockClick: (symbol: string) => void;
}

const LivePricesTable: React.FC<LivePricesTableProps> = ({ onStockClick }) => {
    const [prices, setPrices] = useState<StockPrice[]>([]);
    const [hoveredStock, setHoveredStock] = useState<string | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const stockOrderRef = useRef<string[]>([]);
    const previousPrices = useRef<Record<string, number>>({});

    useEffect(() => {
        // Connect to WebSocket
        const wsUrl = API_BASE_URL.replace('http', 'ws') + '/ws';
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.current.onmessage = (event) => {
            const data: PriceUpdate = JSON.parse(event.data);
            if (data.type === 'priceUpdate' && data.prices) {
                // Save initial order if not set
                if (stockOrderRef.current.length === 0) {
                    stockOrderRef.current = data.prices.map(p => p.symbol);
                }

                // Maintain the original order
                const orderedPrices = stockOrderRef.current
                    .map(symbol => data.prices.find(p => p.symbol === symbol))
                    .filter(Boolean) as StockPrice[];

                data.prices.forEach((price) => {
                    previousPrices.current[price.symbol] = price.price;
                });

                setPrices(orderedPrices);
            }
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const renderMiniChart = (priceHistory?: number[]) => {
        if (!priceHistory || priceHistory.length === 0) return null;

        const max = Math.max(...priceHistory);
        const min = Math.min(...priceHistory);
        const range = max - min || 1;

        return (
            <div className="flex items-end gap-0.5 h-16">
                {priceHistory.slice(-10).map((price, index) => {
                    const height = ((price - min) / range) * 100;
                    return (
                        <div
                            key={index}
                            className="flex-1 bg-blue-500 rounded-t"
                            style={{ height: `${Math.max(height, 5)}%` }}
                        />
                    );
                })}
            </div>
        );
    };

    if (prices.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Live Stock Prices</h2>
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Live Stock Prices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {prices.map((stock) => (
                    <div
                        key={stock.symbol}
                        onClick={() => onStockClick(stock.symbol)}
                        onMouseEnter={() => setHoveredStock(stock.symbol)}
                        onMouseLeave={() => setHoveredStock(null)}
                        className="relative bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-lg"
                    >
                        {/* Stock Info */}
                        <div className="flex items-start gap-3 mb-3">
                            <img
                                src={stock.logo}
                                alt={stock.symbol}
                                className="w-12 h-12 rounded-full flex-shrink-0"
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${stock.symbol}&background=random`;
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-gray-900 text-lg">{stock.symbol}</div>
                                <div className="text-xs text-gray-600 truncate">{stock.name}</div>
                            </div>
                        </div>

                        {/* Price and Change */}
                        <div className="mb-3">
                            <div className="text-2xl font-bold text-gray-900">
                                ${stock.price.toFixed(2)}
                            </div>
                            <div
                                className={`text-sm font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {stock.change >= 0 ? '+' : ''}
                                {stock.change.toFixed(2)}%
                            </div>
                        </div>

                        {/* Mini Chart - Shows on hover */}
                        {hoveredStock === stock.symbol && (
                            <div className="absolute inset-0 bg-white border-2 border-blue-500 rounded-lg p-4 z-10 shadow-xl">
                                <div className="flex items-start gap-3 mb-2">
                                    <img
                                        src={stock.logo}
                                        alt={stock.symbol}
                                        className="w-10 h-10 rounded-full"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${stock.symbol}&background=random`;
                                        }}
                                    />
                                    <div>
                                        <div className="font-bold text-gray-900">{stock.symbol}</div>
                                        <div className="text-xs text-gray-600 truncate">{stock.name}</div>
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-gray-900 mb-1">
                                    ${stock.price.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-600 mb-2">Price History (Last 10)</div>
                                {renderMiniChart(stock.priceHistory)}
                                <div className="text-xs text-gray-500 text-center mt-2">
                                    Click to view details
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LivePricesTable;
