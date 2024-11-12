import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [last7DaysData, setLast7DaysData] = useState(Array(7).fill(0));
  const [dates, setDates] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchExpenses(token);
    }
  }, [token]);

  const fetchExpenses = async (token) => {
    try {
      const response = await axios.get("http://localhost:5029/api/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      calculateLast7DaysData(response.data);
    } catch (error) {
      console.error("Error fetching expenses data", error);
    }
  };

  const calculateLast7DaysData = (expenses) => {
    const now = new Date();
    const days = Array(7).fill(0);
    const dateLabels = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const dateString = day.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dateLabels.push(dateString);

      const dailyTotal = expenses
        .filter((expense) => new Date(expense.date).toDateString() === day.toDateString())
        .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

      days[6 - i] = dailyTotal;
    }

    setLast7DaysData(days);
    setDates(dateLabels);
  };

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Expenses ($)",
        data: last7DaysData,
        backgroundColor: [
          "#8B4BDF",
          "#4BA5DF", 
          "#DFC94B",
          "#8F6FDF",
          "#FF7875",
          "#4BA5DF",
          "#8B4BDF", 
        ],
        borderColor: "#000",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 100,
        },
      },
      y: {
        ticks: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Expenses in Last 7 Days',
        font: {
          size: 20,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div className="chartContainer">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default Analytics;
