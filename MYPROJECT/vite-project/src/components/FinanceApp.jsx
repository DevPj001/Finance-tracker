import React from "react";
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import 'chart.js/auto';
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import styles from './FinanceApp.module.css';


function FinanceApp() {

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

    const [last7DaysData, setLast7DaysData] = useState(Array(7).fill(0));
    const [dates, setDates] = useState([]);

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
            calculateLast7DaysData(response.data);
        } catch (error) {
            console.error('Error fetching expenses data', error);
        }
    };

    const calculateTotals = (expenses) => {
        const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const marketing = expenses.filter(expense => expense.category === 'Marketing')
                                  .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        const tuition = expenses.filter(expense => expense.category === 'Tuition Fees')
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

    const chartData = {
        labels: dates,
        datasets: [
            {
                label: 'Expenses ($)',
                data: last7DaysData,
                backgroundColor: last7DaysData.map((val, idx) =>
                    idx === 6 ? 'green' : '#d3d3d3'
                ),
                borderColor: '#000',
                borderWidth: 1,
                borderRadius: 5,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 100, 
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

  return (
    <main className={styles.financeApp}>
      <Sidebar />
      <Dashboard />
    </main>
  );
}

export default FinanceApp;