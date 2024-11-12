import React, { useEffect, useState } from 'react';
import styles from './ActivitySection.module.css';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';


const ActivitySection = () => {

  const [expenses, setExpenses] = useState([]);
  const token = localStorage.getItem('token');
  const [totals, setTotals] = useState({
    total: 0,
    marketing: 0,
    tuition: 0,
    online: 0,
    taxi: 0,
    others: 0
  });

  useEffect(() => {
    if (token) {
      fetchExpenses(token);
    }
  }, [token]);

  const fetchExpenses = async (token) => {
    try {
      const response = await axios.get('http://localhost:5029/api/data', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExpenses(response.data);
      calculateTotals(response.data);
    } catch (error) {
      console.error('Error fetching expenses data', error);
    }
  };

  const calculateTotals = (expenses) => {
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const marketing = expenses.filter(expense => expense.category === 'marketing')
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const tuition = expenses.filter(expense => expense.category === 'tuition')
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const online = expenses.filter(expense => expense.category === 'online')
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const taxi = expenses.filter(expense => expense.category === 'taxi')
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const others = expenses.filter(expense => expense.category === 'others')
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

    setTotals({ total, marketing, tuition, online, taxi, others });
  };

  const formik = useFormik({
    initialValues: {
        amount: '',
        purpose: '',
        category: ''
    },
    validationSchema: Yup.object({
        amount: Yup.number().required('Amount is required').min(1, 'Amount must be greater than 0'),
        purpose: Yup.string().required('Purpose is required'),
        category: Yup.string().required('Category is required')
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setStatus }) => {
        const date = new Date().toISOString();
        try {
            await axios.post('http://localhost:5029/api/data', { ...values, date }, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            setStatus('success');
            resetForm();
            fetchExpenses(token);
        } catch (error) {
            setStatus('error');
            console.error('Error posting expense data', error);
        } finally {
            setSubmitting(false);
        }
    }
});

  return (
    <section className={styles.activitySection}>
      <h2 className={styles.sectionTitle}>Activity</h2>

      <div className={styles.activityCircles}>
        <div className={`${styles.activityCircle} ${styles.green}`}>
          <div className={styles.activityAmount}>₹{totals.online}</div>
          <div className={styles.activityCategory}>Online Payment</div>
        </div>
        <div className={`${styles.activityCircle} ${styles.grey}`}>
          <div className={styles.activityAmount}>₹{totals.others}</div>
          <div className={styles.activityCategory}>Others</div>
        </div>
        <div className={`${styles.activityCircle} ${styles.white}`}>
          <div className={styles.activityAmount}>₹{totals.taxi}</div>
          <div className={styles.activityCategory}>Taxi</div>
        </div>
      </div>


      <form className={styles.activityForm} onSubmit={formik.handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="amount" className={styles.inputTextLabel}>Amount</label>
          <input
            placeholder="Enter Amount"
            type="number"
            className={styles.inputText}
            id="amount" 
            name="amount"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.amount}
            />
              {formik.touched.amount && formik.errors.amount ?(
                    <div className="text-danger">{formik.errors.amount}</div>
                ):null}

        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="category" className={styles.inputTextLabel}>Purpose</label>
          <input
          placeholder="Purpose"
          type="text"
          id="purpose"
          name="purpose"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value = {formik.values.purpose}
          className={styles.inputText}
          />

{formik.touched.purpose && formik.errors.purpose ? (
            <div className="text-danger">{formik.errors.purpose}</div>
        ) : null}


        </div>
        <fieldset className={styles.radioGroup}>
          <legend className={styles.visuallyHidden}>Transaction Type</legend>
          {['marketing', 'tuition', 'taxi', 'online', 'others'].map((type) => (
            <div key={type} className={styles.radioItem}>
              <input type="radio" id={type} name="category" value={type} className={styles.radioInput} onChange={formik.handleChange}/>
              <label htmlFor={type} className={styles.radioLabel}>{type}</label>
            </div>
          ))}
        </fieldset>
        <button type="submit" className={styles.submitButton}>Add Transaction</button>
      </form>
    </section>
  );
};

export default ActivitySection;
