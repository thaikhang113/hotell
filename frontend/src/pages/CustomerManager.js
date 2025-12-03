import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => { fetchCustomers(); }, []);

    const fetchCustomers = async () => {
        try {
            const res = await axiosClient.get('/customers');
            setCustomers(res.data);
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Deactivate?')) {
            try { await axiosClient.delete(`/customers/${id}`); fetchCustomers(); } 
            catch (err) { alert(err.message); }
        }
    };

    return (
        <div className="container">
            <h3>Customers</h3>
            <table className="table table-striped">
                <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Active</th><th>Action</th></tr></thead>
                <tbody>
                    {customers.map(c => (
                        <tr key={c.user_id}>
                            <td>{c.user_id}</td><td>{c.username}</td><td>{c.email}</td>
                            <td>{c.is_active ? 'Yes' : 'No'}</td>
                            <td><button className="btn btn-warning btn-sm" onClick={() => handleDelete(c.user_id)}>Deactivate</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerManager;