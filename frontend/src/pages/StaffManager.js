import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const StaffManager = () => {
    const [staffs, setStaffs] = useState([]);
    const [form, setForm] = useState({ username: '', password: '', email: '', first_name: '', last_name: '', phone_number: '' });

    useEffect(() => { fetchStaff(); }, []);

    const fetchStaff = async () => {
        try {
            const res = await axiosClient.get('/staff');
            setStaffs(res.data);
        } catch (e) { console.error(e); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/staff', form);
            fetchStaff();
            setForm({ username: '', password: '', email: '', first_name: '', last_name: '', phone_number: '' });
        } catch (err) { alert(err.message); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete?')) {
            try { await axiosClient.delete(`/staff/${id}`); fetchStaff(); } 
            catch (err) { alert(err.message); }
        }
    };

    return (
        <div className="container">
            <h3>Staff Management</h3>
            <form className="mb-4 row g-2" onSubmit={handleCreate}>
                <div className="col"><input className="form-control" placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /></div>
                <div className="col"><input className="form-control" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
                <div className="col"><input className="form-control" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                <div className="col-auto"><button className="btn btn-primary">Add</button></div>
            </form>
            <table className="table">
                <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Phone</th><th>Action</th></tr></thead>
                <tbody>
                    {staffs.map(s => (
                        <tr key={s.user_id}>
                            <td>{s.user_id}</td><td>{s.username}</td><td>{s.email}</td><td>{s.phone_number}</td>
                            <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.user_id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffManager;