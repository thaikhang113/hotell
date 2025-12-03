import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StaffManager from './pages/StaffManager';
import CustomerManager from './pages/CustomerManager';
import RoomManager from './pages/RoomManager';
import BookingManager from './pages/BookingManager';

const PrivateRoute = ({ children, roleRequired }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return <Navigate to="/login" />;
    if (roleRequired && !user.is_staff) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/staff" element={<PrivateRoute roleRequired={true}><StaffManager /></PrivateRoute>} />
                <Route path="/customers" element={<PrivateRoute roleRequired={true}><CustomerManager /></PrivateRoute>} />
                <Route path="/rooms" element={<PrivateRoute roleRequired={true}><RoomManager /></PrivateRoute>} />
                <Route path="/bookings" element={<PrivateRoute><BookingManager /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;