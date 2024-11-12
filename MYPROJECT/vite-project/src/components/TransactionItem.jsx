import React from 'react';
import styles from './FinanceApp.module.css';

function TransactionItem({ purpose, category, amount, date }) {
  return (
    <div className={styles.transactionItem}>
      <div className={styles.transactionDetails}>
        <p className={styles.transactionType}>{purpose}</p>
      </div>
      <p className={styles.transactionType}>{category}</p>
      <p className={styles.transactionCompletion}>{date}</p>
      <p className={styles.transactionAmount}>{amount}</p>
    </div>
  );
}

export default TransactionItem;
