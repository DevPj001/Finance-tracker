import React from 'react';
import styles from './FinanceApp.module.css';
import FinancialOverview from './FinancialOverview';
import TransactionHistory from './TransactionHistory';
import ActivitySection from './ActivitySection';
function Dashboard() {
  return (
    <section className={styles.dashboard}>
      <div className={styles.dashboardContent}>

        
        <div className={styles.mainContent}>
          <FinancialOverview />
          <TransactionHistory />
        </div>
        <ActivitySection />
      </div>
    </section>
  );
}

export default Dashboard;