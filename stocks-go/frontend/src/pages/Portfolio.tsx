import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { StockPrice } from '../types';

interface PortfolioItem {
    symbol: string;
    quantity: number;
    currentPrice: number;
    totalValue: number;
    name: string;
    logo: string;
    change: number;
}

const Portfolio: React.FC = () => {
    const { user, credits, logout } = useAuth();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            // Fetch account to get portfolio
            const accountResponse = await axios.get('/api/account');
            const portfolioData = accountResponse.data.portfolio || {};

            // Fetch current stock prices
            const stocksResponse = await axios.get('/prices');
            const stocks: StockPrice[] = stocksResponse.data;

            // Build portfolio items
            const items: PortfolioItem[] = [];
            let total = 0;

            for (const symbol in portfolioData) {
                const quantity = portfolioData[symbol];
                if (quantity > 0) {
                    const stock = stocks.find(s => s.symbol === symbol);
                    if (stock) {
                        const value = stock.price * quantity;
                        total += value;
                        items.push({
                            symbol: stock.symbol,
                            quantity,
                            currentPrice: stock.price,
                            totalValue: value,
                            name: stock.name,
                            logo: stock.logo,
                            change: stock.change,
                        });
                    }
                }
            }

            // Sort by total value descending
            items.sort((a, b) => b.totalValue - a.totalValue);

            setPortfolio(items);
            setTotalValue(total);
        } catch (err) {
            console.error('Error fetching portfolio:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <p className="text-gray-600">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    const netWorth = credits + totalValue;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Portfolio</h1>
                            <p className="text-gray-600">Welcome back, <span className="font-semibold">{user}</span></p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold opacity-90">Available Credits</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">${credits.toFixed(2)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold opacity-90">Holdings Value</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">${totalValue.toFixed(2)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold opacity-90">Net Worth</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">${netWorth.toFixed(2)}</p>
                    </div>
                </div>

                {/* Holdings Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Your Holdings</h2>
                    </div>

                    {portfolio.length === 0 ? (
                        <div className="p-8 text-center">
                            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-gray-600 text-lg mb-2">No holdings yet</p>
                            <p className="text-gray-500">Start trading to build your portfolio!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Current Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Value
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            24h Change
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {portfolio.map((item) => (
                                        <tr key={item.symbol} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        src={item.logo}
                                                        alt={item.symbol}
                                                        className="w-10 h-10 rounded-full mr-3"
                                                        onError={(e) => {
                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${item.symbol}&background=random`;
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">{item.symbol}</div>
                                                        <div className="text-sm text-gray-500">{item.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">{item.quantity}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">${item.currentPrice.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">${item.totalValue.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm font-semibold ${item.change >= 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
