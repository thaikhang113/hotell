import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const RoomManager = () => {
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({ room_number: '', room_type_id: 1, floor: 1, status: 'available' });

    useEffect(() => { fetchRooms(); }, []);

    const fetchRooms = async () => {
        const res = await axiosClient.get('/rooms');
        setRooms(res.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try { await axiosClient.post('/rooms', form); fetchRooms(); } 
        catch (err) { alert('Error'); }
    };

    const toggleStatus = async (id, current) => {
        const status = current === 'available' ? 'maintenance' : 'available';
        try { await axiosClient.put(`/rooms/${id}/status`, { status }); fetchRooms(); } 
        catch (err) { alert(err.message); }
    };

    return (
        <div className="container">
            <h3>Rooms</h3>
            <form className="mb-4 row g-2" onSubmit={handleCreate}>
                <div className="col"><input className="form-control" placeholder="Room #" onChange={e => setForm({...form, room_number: e.target.value})} required /></div>
                <div className="col"><input type="number" className="form-control" placeholder="Type ID" onChange={e => setForm({...form, room_type_id: e.target.value})} required /></div>
                <div className="col"><input type="number" className="form-control" placeholder="Floor" onChange={e => setForm({...form, floor: e.target.value})} required /></div>
                <div className="col-auto"><button className="btn btn-primary">Add</button></div>
            </form>
            <div className="row">
                {rooms.map(r => (
                    <div className="col-md-3 mb-3" key={r.room_id}>
                        <div className={`card text-white ${r.status === 'available' ? 'bg-success' : 'bg-secondary'}`}>
                            <div className="card-body">
                                <h5>{r.room_number}</h5>
                                <p>Type: {r.room_type_id} | Floor: {r.floor}</p>
                                <p>{r.status}</p>
                                <button className="btn btn-light btn-sm" onClick={() => toggleStatus(r.room_id, r.status)}>Toggle</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomManager;