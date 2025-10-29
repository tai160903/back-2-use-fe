import React, { useState, useEffect } from 'react';
import { FaHistory, FaCheckCircle, FaClock, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import { MdSwapHoriz } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';
import { BiCalendar } from 'react-icons/bi';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './BusinessTransaction.css';

export default function BusinessTransaction() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock transaction data
  const transactions = [
    {
      id: 'TXN001',
      type: 'Material Sale',
      customer: 'John Doe',
      customerId: 'CUST001',
      amount: 250000,
      date: '2024-03-20',
      time: '10:30 AM',
      status: 'Completed',
      paymentMethod: 'Wallet'
    },
    {
      id: 'TXN002',
      type: 'Material Sale',
      customer: 'Jane Smith',
      customerId: 'CUST002',
      amount: 180000,
      date: '2024-03-20',
      time: '09:15 AM',
      status: 'Completed',
      paymentMethod: 'Cash'
    },
    {
      id: 'TXN003',
      type: 'Voucher Redemption',
      customer: 'Mike Johnson',
      customerId: 'CUST003',
      amount: -50000,
      date: '2024-03-19',
      time: '03:45 PM',
      status: 'Pending',
      paymentMethod: 'Wallet'
    },
    {
      id: 'TXN004',
      type: 'Material Sale',
      customer: 'Sarah Wilson',
      customerId: 'CUST004',
      amount: 320000,
      date: '2024-03-19',
      time: '11:20 AM',
      status: 'Completed',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'TXN005',
      type: 'Material Sale',
      customer: 'David Brown',
      customerId: 'CUST005',
      amount: 150000,
      date: '2024-03-18',
      time: '02:30 PM',
      status: 'Failed',
      paymentMethod: 'Wallet'
    },
    {
      id: 'TXN006',
      type: 'Subscription Payment',
      customer: 'Emma Davis',
      customerId: 'CUST006',
      amount: 500000,
      date: '2024-03-18',
      time: '08:00 AM',
      status: 'Completed',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'TXN007',
      type: 'Material Sale',
      customer: 'Chris Lee',
      customerId: 'CUST007',
      amount: 220000,
      date: '2024-03-17',
      time: '04:15 PM',
      status: 'Completed',
      paymentMethod: 'Cash'
    },
    {
      id: 'TXN008',
      type: 'Voucher Redemption',
      customer: 'Lisa Anderson',
      customerId: 'CUST008',
      amount: -30000,
      date: '2024-03-17',
      time: '01:30 PM',
      status: 'Completed',
      paymentMethod: 'Wallet'
    },
    {
      id: 'TXN009',
      type: 'Material Sale',
      customer: 'Tom Harris',
      customerId: 'CUST009',
      amount: 280000,
      date: '2024-03-16',
      time: '10:45 AM',
      status: 'Pending',
      paymentMethod: 'Wallet'
    },
    {
      id: 'TXN010',
      type: 'Material Sale',
      customer: 'Amy Chen',
      customerId: 'CUST010',
      amount: 195000,
      date: '2024-03-16',
      time: '09:00 AM',
      status: 'Completed',
      paymentMethod: 'Bank Transfer'
    }
  ];

  // Calculate statistics
  const totalTransactions = transactions.length;
  const completedCount = transactions.filter(t => t.status === 'Completed').length;
  const pendingCount = transactions.filter(t => t.status === 'Pending').length;
  const totalRevenue = transactions
    .filter(t => t.status === 'Completed' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  // Filter transactions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    if (filter !== 'All') {
      filtered = filtered.filter(t => t.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Math.abs(amount));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <FaCheckCircle />;
      case 'Pending':
        return <FaClock />;
      case 'Failed':
        return <FaTimesCircle />;
      default:
        return null;
    }
  };

  return (
    <div className="business-transaction-page">
      {/* Header */}
      <div className="transaction-header">
        <div className="transaction-title-section">
          <MdSwapHoriz className="transaction-title-icon" />
          <div>
            <h1 className="transaction-title">Transaction History</h1>
            <p className="transaction-description">
              View and manage all your business transactions
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="transaction-stats">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Total Transactions</h3>
              <span className="stat-number">{totalTransactions}</span>
            </div>
            <FaHistory className="stat-icon" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Total Revenue</h3>
              <span className="stat-number revenue">{formatCurrency(totalRevenue)}</span>
            </div>
            <FaMoneyBillWave className="stat-icon revenue" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Completed</h3>
              <span className="stat-number completed">{completedCount}</span>
            </div>
            <FaCheckCircle className="stat-icon completed" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3 className="stat-title">Pending</h3>
              <span className="stat-number pending">{pendingCount}</span>
            </div>
            <FaClock className="stat-icon pending" />
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="transaction-filters">
        <div className="search-container">
          <IoIosSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by ID, Customer, Type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'All' ? 'active' : ''}`}
            onClick={() => handleFilterChange('All')}
          >
            <FaHistory />
            All ({totalTransactions})
          </button>
          <button
            className={`filter-tab ${filter === 'Completed' ? 'active' : ''}`}
            onClick={() => handleFilterChange('Completed')}
          >
            <FaCheckCircle />
            Completed ({completedCount})
          </button>
          <button
            className={`filter-tab ${filter === 'Pending' ? 'active' : ''}`}
            onClick={() => handleFilterChange('Pending')}
          >
            <FaClock />
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-section">
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <span className="transaction-id">{transaction.id}</span>
                    </td>
                    <td>
                      <span className="transaction-type">{transaction.type}</span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{transaction.customer}</span>
                        <span className="customer-id">ID: {transaction.customerId}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                        {transaction.amount < 0 ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td>
                      <div className="datetime-info">
                        <div className="date">
                          <BiCalendar /> {transaction.date}
                        </div>
                        <div className="time">{transaction.time}</div>
                      </div>
                    </td>
                    <td>
                      <span className="payment-method">{transaction.paymentMethod}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                        {getStatusIcon(transaction.status)}
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Stack spacing={2} className="pagination-container">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}
      </div>
    </div>
  );
}
