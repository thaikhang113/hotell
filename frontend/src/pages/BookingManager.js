import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [newBooking, setNewBooking] = useState({ customer_id: '', room_id: '', check_in_date: '', check_out_date: '' });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => { fetchBookings(); }, []);

    const fetchBookings = async () => {
        try {
            const res = await axiosClient.get('/bookings');
            if (user.is_staff) setBookings(res.data);
            else setBookings(res.data.filter(b => b.customer_id === user.user_id));
        } catch (e) { setBookings([]); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = user.is_staff ? newBooking : { ...newBooking, customer_id: user.user_id };
            await axiosClient.post('/bookings', payload);
            fetchBookings();
            alert('Booking Created');
        } catch (err) { alert('Failed: Check room availability'); }
    };

    const handleCheckout = async (id) => {
        try { await axiosClient.post(`/bookings/${id}/checkout`); fetchBookings(); } 
        catch (err) { alert(err.message); }
    };

    return (
        <div className="container">
            <h3>Bookings</h3>
            <form className="mb-4 p-3 bg-light" onSubmit={handleCreate}>
                <div className="row">
                    {user.is_staff && (
                         <div className="col-md-3"><input className="form-control" placeholder="Cust ID" onChange={e => setNewBooking({...newBooking, customer_id: e.target.value})} /></div>
                    )}
                    <div className="col-md-3"><input className="form-control" placeholder="Room ID" onChange={e => setNewBooking({...newBooking, room_id: e.target.value})} required /></div>
                    <div className="col-md-3"><input type="date" className="form-control" onChange={e => setNewBooking({...newBooking, check_in_date: e.target.value})} required /></div>
                    <div className="col-md-3"><input type="date" className="form-control" onChange={e => setNewBooking({...newBooking, check_out_date: e.target.value})} required /></div>
                </div>
                <button className="btn btn-primary mt-2">Book</button>
            </form>
            <table className="table">
                <thead><tr><th>ID</th><th>Room</th><th>In</th><th>Out</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                    {bookings.map(b => (
                        <tr key={b.booking_id}>
                            <td>{b.booking_id}</td><td>{b.room_id}</td>
                            <td>{new Date(b.check_in_date).toLocaleDateString()}</td>
                            <td>{new Date(b.check_out_date).toLocaleDateString()}</td>
                            <td>{b.status}</td>
                            <td>
                                {b.status !== 'completed' && user.is_staff && 
                                    <button className="btn btn-info btn-sm" onClick={() => handleCheckout(b.booking_id)}>Checkout</button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingManager;