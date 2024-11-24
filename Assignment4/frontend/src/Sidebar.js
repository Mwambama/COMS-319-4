import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './style.css';

const Sidebar = () => {
  const location = useLocation(); // Hook to get current route

  return (
    <div className="d-flex flex-column vh-100 p-3 bg-light" style={{ width: '250px' }}>
      <h2 className="text-center mb-4">Navigation</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            to="/"
            className={`nav-link text-dark ${location.pathname === '/' ? 'active' : ''}`}
            style={{ transition: 'background-color 0.3s ease' }}
          >
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/contacts"
            className={`nav-link text-dark ${location.pathname === '/contacts' ? 'active' : ''}`}
            style={{ transition: 'background-color 0.3s ease' }}
          >
            View All Contacts
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/search-contacts"
            className={`nav-link text-dark ${location.pathname === '/search-contacts' ? 'active' : ''}`}
            style={{ transition: 'background-color 0.3s ease' }}
          >
            Search Contacts
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/add-contact"
            className={`nav-link text-dark ${location.pathname === '/add-contact' ? 'active' : ''}`}
            style={{ transition: 'background-color 0.3s ease' }}
          >
            Add Contact
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/delete-contact"
            className={`nav-link text-dark ${location.pathname === '/delete-contact' ? 'active' : ''}`}
            style={{ transition: 'background-color 0.3s ease' }}
          >
            Delete Contact
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/update-contact"
            className={`nav-link text-dark ${location.pathname === '/update-contact' ? 'active' : ''}`}
            style={{ transition: 'background-color 0.3s ease' }}
          >
            Update Contact
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
