// src/components/ForexRates.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ForexRates = () => {
  const [rates, setRates] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [timestamp, setTimestamp] = useState(0);
  const [amount, setAmount] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.forexrateapi.com/v1/latest?api_key=1681b36dabd5442115c84db5592a0dec');
        setRates(response.data.rates);
        setBaseCurrency(response.data.base);
        setTimestamp(response.data.timestamp);
        convertCurrency(amount, selectedCurrency);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [amount, selectedCurrency]);

  const convertCurrency = (amount, currency) => {
    const rate = rates[currency];
    const converted = amount * parseFloat(rate);
  setConvertedAmount(isNaN(converted) ? 0 : converted);
  };

  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value);
    setAmount(newAmount || 0);
  };

  const handleCurrencyChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCurrency(selectedValue);

    if (selectedValue === '') {
      setConvertedAmount(0);
    }
  };

  return (
    <div className="container">
      <h2 className="text-3xl font-bold mb-4">Forex Rates ({baseCurrency})</h2>
      <p className="text-gray-600">Last Updated: {new Date(timestamp * 1000).toLocaleString()}</p>

      <div className="currency-section">
        <label className="mr-4">
          Amount:
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="currency-input ml-2"
          />
        </label>
        <label>
          Currency:
          <select
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className="currency-select mr-2 ml-2"
          >
            <option value="">Select a currency</option>
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-2 font-bold">Converted Amount: {convertedAmount.toFixed(2)}</p>
      </div>

      {/* Forex Rates Table */}
      <table className="forex-table">
        <thead>
          <tr>
            <th>Currency</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(rates).map((currency) => (
            <tr key={currency}>
              <td>{currency}</td>
              <td>{rates[currency]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForexRates;
