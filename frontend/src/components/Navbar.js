import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">Hotel System</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
                        {user.is_staff && (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/staff">Staff</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/customers">Customers</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/rooms">Rooms</Link></li>
                            </>
                        )}
                        <li className="nav-item"><Link className="nav-link" to="/bookings">Bookings</Link></li>
                    </ul>
                    <div className="d-flex align-items-center text-white">
                        <span className="me-3">Hi, {user.username}</span>
                        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;