import React, { useEffect, useState } from 'react';
import styles from './FinanceApp.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Sidebar() {
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5029/api/auth/user-info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data.user);
        setLoading(false); 
      } catch (error) {
        setError('Error fetching user information'); 
        setLoading(false); 
      }
    };

    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [token]);

  const menuItems = [
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9a17ae8840060c66643c81d66f517bb5b245985586425e731c7895d022948636?placeholderIfAbsent=true&apiKey=3d53a6e81524400e8a0685ea628ce423', label: 'Dashboard' },
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/652d690ee699ba96a3150b54d15893c2492c6eebcb26a901e96408517e783252?placeholderIfAbsent=true&apiKey=3d53a6e81524400e8a0685ea628ce423', label: 'Analytics', link: '/analytics' },
  ];

  const preferenceItems = [
    { icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/57f3783f1e3289741e67bfef11919151c71dad23ac8e6f09f86645fce901f90c?placeholderIfAbsent=true&apiKey=3d53a6e81524400e8a0685ea628ce423', label: 'Security', link: '/change-password' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/fa6781df5cb2a993fe5863bb105dc67e9aaf70128de0c7af074d42e1a467b1d6?placeholderIfAbsent=true&apiKey=3d53a6e81524400e8a0685ea628ce423" alt="FinTrack Logo" className={styles.logo} />
        <h1 className={styles.appName}>CashSplash</h1>
      </div>
      <nav className={styles.sidebarNav}>
        <h2 className={styles.navTitle}>Manage</h2>
        <ul className={styles.navList}>
          {menuItems.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <Link to={item.link ? item.link : '#'}>
                <img src={item.icon} alt={item.label} className={styles.navIcon} />
              </Link>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <h2 className={styles.navTitle}>Preferences</h2>
        <ul className={styles.navList}>
          {preferenceItems.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <Link to={item.link ? item.link : '#'}>
                <img src={item.icon} alt={item.label} className={styles.navIcon} />
              </Link>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.userProfile}>
        <div className={styles.userInfo}>
          {loading ? ( 
            <p>Loading...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <>
              <p className={styles.userName}>{userInfo.name}</p>
              <p className={styles.userEmail}>{userInfo.email}</p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
