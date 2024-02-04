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
    setConvertedAmount(amount * rate);
  };

  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value);
    setAmount(newAmount || 0);
  };

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  return (
    <div>
      <h2>Forex Rates ({baseCurrency})</h2>
      <p>Last Updated: {new Date(timestamp * 1000).toLocaleString()}</p>

      {/* Currency Converter */}
      <div>
        <label>
          Amount:
          <input type="number" value={amount} onChange={handleAmountChange} />
        </label>
        <label>
          Currency:
          <select value={selectedCurrency} onChange={handleCurrencyChange}>
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </label>
        <p>Converted Amount: {convertedAmount.toFixed(2)}</p>
      </div>

      {/* Forex Rates Table */}
      <table>
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
