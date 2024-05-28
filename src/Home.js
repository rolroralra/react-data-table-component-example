import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={styles.container}>
      <Link to="/page1" style={styles.button}>Brand Management</Link>
      <Link to="/page2" style={styles.button}>Item Management</Link>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  button: {
    display: 'block',
    margin: '10px',
    padding: '10px 20px',
    textDecoration: 'none',
    color: '#fff',
    backgroundColor: '#007bff',
    borderRadius: '5px',
  },
};

export default Home;