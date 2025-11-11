import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LivePricesTable from '../components/LivePricesTable';
import StockDetail from '../components/StockDetail';
import OrdersTable from '../components/OrdersTable';

const Dashboard: React.FC = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user, credits, logout } = useAuth();

    const handleOrderCreated = () => {
        // Trigger OrdersTable refresh
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleStockClick = (symbol: string) => {
        setSelectedStock(symbol);
    };

    const handleCloseDetail = () => {
        setSelectedStock(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Trading Dashboard</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Credits: <span className="font-bold text-green-600">${credits.toFixed(2)}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">Welcome, <strong>{user}</strong></span>
                            <button
                                onClick={() => navigate('/portfolio')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Portfolio
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
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Live Prices */}
                    <LivePricesTable onStockClick={handleStockClick} />

                    {/* Orders Table */}
                    <OrdersTable refreshTrigger={refreshTrigger} />
                </div>
            </main>

            {/* Stock Detail Modal */}
            {selectedStock && (
                <StockDetail
                    symbol={selectedStock}
                    onClose={handleCloseDetail}
                    onOrderCreated={handleOrderCreated}
                />
            )}
        </div>
    );
};

export default Dashboard;
