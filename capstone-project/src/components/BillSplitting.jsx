import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BillSplitting.css'; // Ensure this import matches your file structure

const BillSplitter = () => {
  const [totalAmount, setTotalAmount] = useState("");
  const [tipPercentage, setTipPercentage] = useState("");
  const [customTipAmount, setCustomTipAmount] = useState(""); // New state for custom tip amount
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [amountPerPerson, setAmountPerPerson] = useState(0);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get("/api/bills");
    console.log('Bills fetched:', response.data);
    if (Array.isArray(response.data)) {
      setBills(response.data);
    } else {
      console.error("Unexpected data format:", response.data);
    }
  } catch (error) {
    console.error("Error fetching bills:", error);
  }
};

    fetchBills();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculateSplit = async () => {
    const total = parseFloat(totalAmount);
    const tip = customTipAmount ? parseFloat(customTipAmount) : parseFloat(tipPercentage);
    const people = parseInt(numberOfPeople, 10);

    const totalWithTip = total + (total * tip) / 100;
    const splitAmount = totalWithTip / people;

    setAmountPerPerson(splitAmount.toFixed(2));

    try {
      await axios.post("/api/bills", {
        totalAmount: total,
        tipPercentage: tipPercentage,
        customTipAmount: customTipAmount,
        numberOfPeople: people,
        amountPerPerson: splitAmount.toFixed(2),
      });
      // Refresh the list of bills
      const response = await axios.get("/api/bills");
      setBills(response.data);
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const clearFields = () => {
    setTotalAmount("");
    setTipPercentage("");
    setCustomTipAmount(""); // Clear custom tip amount
    setNumberOfPeople("");
    setAmountPerPerson(0);
  };

  return (
    <div className="container">
      <h1>Bill Splitter</h1>
      <input
        type="number"
        placeholder="Total Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Tip Percentage"
        value={tipPercentage}
        onChange={(e) => setTipPercentage(e.target.value)}
      />
      <input
        type="number"
        placeholder="Custom Tip Amount"
        value={customTipAmount}
        onChange={(e) => setCustomTipAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of People"
        value={numberOfPeople}
        onChange={(e) => setNumberOfPeople(e.target.value)}
      />
      <div className="button-container">
        <button className="calculate" onClick={calculateSplit}>Calculate</button>
        <button className="clear" onClick={clearFields}>Clear</button>
      </div>
      <h2>Amount per Person: {formatCurrency(amountPerPerson)}</h2>

      <h3>Previous Bills:</h3>
      <ul>
        {bills.map((bill, index) => (
          <li key={index}>
            Total: {formatCurrency(bill.totalAmount)}, Tip: {bill.customTipAmount ? formatCurrency(bill.customTipAmount) : `${bill.tipPercentage}%`}, People: {bill.numberOfPeople}, Amount per Person: {formatCurrency(bill.amountPerPerson)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillSplitter;
