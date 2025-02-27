import React from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom';
import './index.css'
import AppRouter from './components/AppRouter';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div className="app-container">
        <Navbar isHomePage={isHomePage} />
        <div className="main-content">
          <AppRouter />
        </div>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
