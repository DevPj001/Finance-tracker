import React, { useEffect, useState } from 'react';
import styles from './FinanceApp.module.css';
import FinancialCard from './FinancialCard';
import axios from 'axios';

function FinancialOverview() {
    const [expenses, setExpenses] = useState([]);
    const token = localStorage.getItem('token');
    const [totals, setTotals] = useState({
        total: 0,
        marketing: 0,
        tuition: 0,
        online: 0,
        taxi: 0,
        others: 0,
    });
    const [last7DaysData, setLast7DaysData] = useState(Array(7).fill(0));
    const [dates, setDates] = useState([]);

    useEffect(() => {
        if (token) {
            fetchExpenses(token); 

            const intervalId = setInterval(() => {
                fetchExpenses(token);
            }, 100);

            return () => clearInterval(intervalId);
        }
    }, [token]);

    const fetchExpenses = async (token) => {
        try {
            const response = await axios.get('http://localhost:5029/api/data', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setExpenses(response.data);
            calculateTotals(response.data);
            calculateLast7DaysData(response.data);
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
        const online = expenses.filter(expense => expense.category === 'Online')
            .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const taxi = expenses.filter(expense => expense.category === 'Taxi')
            .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const others = expenses.filter(expense => expense.category === 'Others')
            .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

        setTotals({ total, marketing, tuition, online, taxi, others });
    };

    const calculateLast7DaysData = (expenses) => {
        const now = new Date();
        const days = Array(7).fill(0);
        const dateLabels = [];

        for (let i = 6; i >= 0; i--) {
            const day = new Date(now);
            day.setDate(now.getDate() - i);
            const dateString = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateLabels.push(dateString);

            const dailyTotal = expenses.filter(expense => new Date(expense.date).toDateString() === day.toDateString())
                .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

            days[6 - i] = dailyTotal;
        }

        setLast7DaysData(days);
        setDates(dateLabels);
    };

    return (
        <div className={styles.financialOverview}>
            <FinancialCard title="Total" amount={totals.total} />
            <FinancialCard title="Marketing" amount={totals.marketing} />
            <FinancialCard title="Tuition" amount={totals.tuition} />
        </div>
    );
}

export default FinancialOverview;
