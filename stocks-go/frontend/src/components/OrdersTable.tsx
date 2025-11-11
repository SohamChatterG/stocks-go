import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Order, StockPrice } from '../types';

interface OrdersTableProps {
    refreshTrigger?: number;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ refreshTrigger }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stocks, setStocks] = useState<Record<string, StockPrice>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Filters
    const [filterSymbol, setFilterSymbol] = useState<string>('all');
    const [filterDate, setFilterDate] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const [ordersRes, pricesRes] = await Promise.all([
                axios.get('/api/orders'),
                axios.get('/prices')
            ]);
            setOrders(ordersRes.data || []);

            // Create a map of stocks for quick lookup
            const stockMap: Record<string, StockPrice> = {};
            (pricesRes.data || []).forEach((stock: StockPrice) => {
                stockMap[stock.symbol] = stock;
            });
            setStocks(stockMap);
        } catch (err: any) {
            setError('Failed to fetch orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [refreshTrigger]);

    const getSideBadgeColor = (side: string): string => {
        return side === 'buy'
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300';
    };

    const getStatusBadgeColor = (status: string): string => {
        return status === 'done'
            ? 'bg-blue-100 text-blue-800 border border-blue-300'
            : 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Get unique symbols and dates for filters
    const symbols = Array.from(new Set(orders.map(o => o.symbol)));
    const dates = Array.from(new Set(orders.map(o => formatDate(o.createdAt))));

    // Apply filters
    const filteredOrders = orders.filter(order => {
        if (filterSymbol !== 'all' && order.symbol !== filterSymbol) return false;
        if (filterStatus !== 'all' && order.status !== filterStatus) return false;
        if (filterDate !== 'all' && formatDate(order.createdAt) !== filterDate) return false;
        return true;
    });

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md p-6">

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Stock</label>
                    <select
                        value={filterSymbol}
                        onChange={(e) => setFilterSymbol(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Stocks</option>
                        {symbols.map(symbol => (
                            <option key={symbol} value={symbol}>{symbol}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Date</label>
                    <select
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Dates</option>
                        {dates.map(date => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="done">Done</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md mb-4">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-slate-800">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Side
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {stocks[order.symbol] && (
                                                <img
                                                    src={stocks[order.symbol].logo}
                                                    alt={order.symbol}
                                                    className="w-8 h-8 rounded-full"
                                                    onError={(e) => {
                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${order.symbol}&background=random`;
                                                    }}
                                                />
                                            )}
                                            <span className="font-semibold text-gray-800 dark:text-gray-100">{order.symbol}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getSideBadgeColor(
                                                order.side
                                            )}`}
                                        >
                                            {order.side}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${order.orderType === 'market'
                                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                                : 'bg-purple-100 text-purple-800 border border-purple-300'
                                                }`}
                                        >
                                            {order.orderType || 'limit'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">
                                        {order.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-100">
                                        ${order.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadgeColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!loading && filteredOrders.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                        Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersTable;
