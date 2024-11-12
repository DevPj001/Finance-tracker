import React, { useState, useEffect } from 'react';
import styles from './FinanceApp.module.css';
import TransactionItem from './TransactionItem';
import axios from 'axios';

function TransactionHistory() {
  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem('token');

  const fetchExpenses = () => {
    axios
      .get('http://localhost:5029/api/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the expenses data', error);
      });
  };

  useEffect(() => {
    fetchExpenses();

    const intervalId = setInterval(() => {
      fetchExpenses(); 
    }, 100);

    return () => clearInterval(intervalId);
  }, [token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <section className={styles.transactionHistory}>
      <h3 className={styles.transactionTitle}>Transaction History</h3>
      <div className={styles.TransactionItem}>
        {expenses.map((expense, index) => (
          <TransactionItem
            key={expense.id || index} 
            purpose={expense.purpose}
            category={expense.category}
            amount={expense.amount}
            date={formatDate(expense.date)}
          />
        ))}
      </div>
    </section>
  );
}

export default TransactionHistory;
