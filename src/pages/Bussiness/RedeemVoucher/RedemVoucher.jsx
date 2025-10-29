import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaGift, FaCheckCircle, FaTimesCircle, FaCopy } from 'react-icons/fa';
import { MdRedeem } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';
import { BiDetail } from 'react-icons/bi';
import './RedemVoucher.css';

export default function RedemVoucher() {
  const dispatch = useDispatch();
  const [inputCode, setInputCode] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample voucher codes for demo
  const sampleCodes = [
    { code: 'REDEEM-VAL10', discount: '0%', used: '10,000 used' },
    { code: 'OFFERREL-DEMO', discount: '0%', used: '0% used' },
    { code: 'WELCOME-NEW', discount: '0%', used: '0% used' },
  ];

  // Mock data for voucher usage history
  const usageHistory = [
    {
      id: 1,
      customerName: 'John Doe',
      customerId: 'CUST001',
      code: 'REDEEM-VAL10',
      dateTime: '3/20/2024\n10:30 AM',
      voucherValue: '10%',
      status: 'Success'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      customerId: 'CUST002',
      code: 'OFFERREL-DEMO',
      dateTime: '3/15/2024\n02:15 PM',
      voucherValue: '15%',
      status: 'Success'
    },
    {
      id: 3,
      customerName: 'Mike Johnson',
      customerId: 'CUST003',
      code: 'INVALID-CODE',
      dateTime: '3/15/2024\n11:45 AM',
      voucherValue: 'N/A',
      status: 'Failed'
    },
    {
      id: 4,
      customerName: 'Sarah Wilson',
      customerId: 'CUST004',
      code: 'EXPIRED-2024',
      dateTime: '3/10/2024\n09:20 AM',
      voucherValue: 'N/A',
      status: 'Failed'
    }
  ];

  // Mock data for active vouchers
  const activeVouchers = [
    {
      id: 1,
      voucherName: 'Summer Sale',
      customerName: 'All Customers',
      customerId: '-',
      code: 'SUMMER-2024',
      dateTime: '3/20/2024\n10:30 AM',
      status: 'Active'
    },
    {
      id: 2,
      voucherName: 'New User Bonus',
      customerName: 'New Users',
      customerId: '-',
      code: 'NEWUSER-50',
      dateTime: '3/18/2024\n02:00 PM',
      status: 'Active'
    },
    {
      id: 3,
      voucherName: 'Flash Sale',
      customerName: 'All Customers',
      customerId: '-',
      code: 'FLASH-20',
      dateTime: '3/15/2024\n08:00 AM',
      status: 'Active'
    }
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code "${code}" copied to clipboard!`);
  };

  const handleRedeemCode = () => {
    if (!inputCode.trim()) {
      alert('Please enter a voucher code');
      return;
    }
    // TODO: Implement API call to redeem voucher
    alert(`Redeeming code: ${inputCode}`);
    setInputCode('');
  };

  const getFilteredHistory = () => {
    let filtered = [...usageHistory];
    
    if (filter === 'Business') {
      filtered = filtered.filter(item => item.status === 'Success');
    } else if (filter === 'Failed') {
      filtered = filtered.filter(item => item.status === 'Failed');
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredHistory = getFilteredHistory();
  const successCount = usageHistory.filter(item => item.status === 'Success').length;
  const failedCount = usageHistory.filter(item => item.status === 'Failed').length;

  return (
    <div className="redeem-voucher-page">
      {/* Header */}
      <div className="redeem-header">
        <div className="redeem-title-section">
          <MdRedeem className="redeem-title-icon" />
          <div>
            <h1 className="redeem-title">Redeem Voucher</h1>
            <p className="redeem-description">
              Redeem voucher codes and view usage history
            </p>
          </div>
        </div>
      </div>

      {/* Demo Voucher Codes Section */}
      <div className="demo-codes-section">
        <h3 className="section-title">
          <FaGift className="section-icon" />
          Demo Voucher Codes
        </h3>
        <p className="section-subtitle">
          Use these sample codes to test the redemption functionality
        </p>

        <div className="demo-codes-grid">
          {sampleCodes.map((item, index) => (
            <div key={index} className="demo-code-card">
              <div className="demo-code-header">
                <span className="demo-code-label">Code:</span>
                <span className="demo-code-value">{item.code}</span>
                <button
                  className="copy-btn"
                  onClick={() => handleCopyCode(item.code)}
                  title="Copy code"
                >
                  <FaCopy />
                </button>
              </div>
              <div className="demo-code-details">
                <span className="demo-discount">{item.discount} Discount</span>
                <span className="demo-usage">{item.used}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Voucher Code Section */}
      <div className="input-code-section">
        <h3 className="section-title">
          <MdRedeem className="section-icon" />
          Input Voucher Code
        </h3>
        <p className="section-subtitle">
          Enter the customer's voucher code and click redeem to validate and process
        </p>

        <div className="input-code-container">
          <input
            type="text"
            placeholder="Enter voucher code..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            className="voucher-input"
          />
          <button
            className="redeem-btn"
            onClick={handleRedeemCode}
          >
            <MdRedeem />
            Redeem
          </button>
        </div>
      </div>

      {/* Voucher Usage History */}
      <div className="usage-history-section">
        <h3 className="section-title">
          <FaGift className="section-icon" />
          Voucher Usage History
        </h3>
        <p className="section-subtitle">
          View the history of all voucher redemptions (attempts)
        </p>

        {/* Filter Tabs */}
        <div className="history-filters">
          <button
            className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            ALL ({usageHistory.length})
          </button>
          <button
            className={`filter-tab ${filter === 'Business' ? 'active' : ''}`}
            onClick={() => setFilter('Business')}
          >
            Business ({successCount})
          </button>
          <button
            className={`filter-tab ${filter === 'Failed' ? 'active' : ''}`}
            onClick={() => setFilter('Failed')}
          >
            Failed ({failedCount})
          </button>
        </div>

        {/* History Table */}
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Customer Name (ID)</th>
                <th>Code</th>
                <th>Date & Time</th>
                <th>Voucher Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{item.customerName}</span>
                        <span className="customer-id">ID: {item.customerId}</span>
                      </div>
                    </td>
                    <td>
                      <span className="code-badge">{item.code}</span>
                    </td>
                    <td>
                      <div className="datetime-info">
                        {item.dateTime.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className="voucher-value">{item.voucherValue}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                        {item.status === 'Success' ? (
                          <><FaCheckCircle /> Success</>
                        ) : (
                          <><FaTimesCircle /> Failed</>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No voucher usage history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Active Vouchers from Admin */}
      <div className="active-vouchers-section">
        <h3 className="section-title">
          <FaGift className="section-icon" />
          All Active Vouchers from Admin
        </h3>
        <p className="section-subtitle">
          View all vouchers that are available for redemption
        </p>

        {/* Active Vouchers Table */}
        <div className="active-table-container">
          <table className="active-table">
            <thead>
              <tr>
                <th>Voucher Name</th>
                <th>Customer Name (ID)</th>
                <th>Code</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeVouchers.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="voucher-name">{item.voucherName}</span>
                  </td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{item.customerName}</span>
                      <span className="customer-id">{item.customerId}</span>
                    </div>
                  </td>
                  <td>
                    <span className="code-badge">{item.code}</span>
                  </td>
                  <td>
                    <div className="datetime-info">
                      {item.dateTime.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="status-badge active">
                      <FaCheckCircle /> {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn view-btn">
                      <BiDetail />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
