import React from 'react';
import styles from './FinanceApp.module.css';

function FinancialCard({ title, amount }) {
  return (
    <div className={`${styles.financialCard} `}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}> {title}</h3>
        <p className={styles.cardAmount}>₹ {amount}</p>
      </div>
    </div>
  );
}

export default FinancialCard;