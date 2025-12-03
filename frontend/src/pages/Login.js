import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Mặc định là user (customer)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Xác định API cần gọi dựa trên Role
            const endpoint = role === 'staff' ? '/staff' : '/customers';
            
            // 2. Tải toàn bộ danh sách user về (Vì backend thiếu API login)
            const res = await axiosClient.get(endpoint);
            
            // 3. Tìm user khớp username
            const user = res.data.find(u => u.username === username);
            
            if (!user) {
                alert('Tài khoản không tồn tại!');
                setLoading(false);
                return;
            }

            // 4. Kiểm tra mật khẩu (Backend lưu password thường hoặc hash, so sánh trực tiếp)
            // Lưu ý: Trường mật khẩu trong DB có thể là 'password' hoặc 'password_hash'
            const dbPass = user.password || user.password_hash;
            
            if (dbPass == password) { // Dùng == để so sánh lỏng lẻo phòng trường hợp số/chuỗi
                // Login thành công -> Lưu vào localStorage
                localStorage.setItem('token', 'demo-token-123456'); // Token giả để qua mặt router
                localStorage.setItem('user', JSON.stringify({ ...user, is_staff: role === 'staff' }));
                alert(`Xin chào ${user.username}!`);
                navigate('/');
            } else {
                alert('Sai mật khẩu!');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi kết nối Server: ' + (error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card shadow p-4">
                <h3 className="text-center">Đăng Nhập</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label>Tài khoản</label>
                        <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label>Mật khẩu</label>
                        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label>Bạn là ai?</label>
                        <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="user">Khách hàng (Customer)</option>
                            <option value="staff">Nhân viên (Staff)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                    <div className="mt-3 text-center">
                        <Link to="/register">Chưa có tài khoản? Đăng ký ngay</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;