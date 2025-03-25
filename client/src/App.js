import React from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom';
import './index.css'
import AppRouter from './components/AppRouter';
import Navbar from './components/Navbar/Navbar';
import AdminNavbar from './components/Navbar/AdminNavbar';
import Footer from './components/Footer/Footer';

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (

    <>
      <div className={`app-container ${isAdminPage ? 'admin-background' : ''}`}>
        {isAdminPage ? <AdminNavbar /> : <Navbar isHomePage={isHomePage} />}
        <div className="main-content">
          <AppRouter />
        </div>
        {!isAdminPage && <Footer />}
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
