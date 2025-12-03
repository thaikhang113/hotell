import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        address: 'Vietnam', // Giá trị mặc định để tránh lỗi
        date_of_birth: '2000-01-01', // Định dạng chuẩn YYYY-MM-DD
        gender: 'Other'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Đang gửi dữ liệu đăng ký:', formData);
            // Gọi API tạo customer
            await axiosClient.post('/customers', formData);
            alert('Đăng ký thành công! Hãy đăng nhập ngay.');
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data?.error || error.message;
            alert('Lỗi đăng ký: ' + msg);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <div className="card shadow p-4">
                <h3 className="text-center mb-3">Đăng ký Tài khoản</h3>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label>Tên đăng nhập (*)</label>
                        <input name="username" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Mật khẩu (*)</label>
                        <input name="password" type="password" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                        <label>Email (*)</label>
                        <input name="email" type="email" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label>Họ</label>
                        <input name="first_name" className="form-control" onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label>Tên</label>
                        <input name="last_name" className="form-control" onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label>Số điện thoại</label>
                        <input name="phone_number" className="form-control" onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label>Ngày sinh</label>
                        <input name="date_of_birth" type="date" className="form-control" onChange={handleChange} />
                    </div>
                    <div className="col-12">
                        <label>Địa chỉ</label>
                        <input name="address" className="form-control" onChange={handleChange} placeholder="Địa chỉ mặc định..." />
                    </div>
                    
                    <button type="submit" className="btn btn-success w-100 mt-3">Đăng Ký</button>
                    
                    <div className="text-center mt-2">
                        <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;