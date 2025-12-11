import axios from "axios";

// Địa chỉ backend trong Docker
const API_URL = "http://backend:3000/api";

class AdminController {
  
  // --- STAFF ---
  async getStaff(req, res) {
    try {
      const response = await axios.get(`${API_URL}/staff`);
      
      const staffList = Array.isArray(response.data) 
        ? response.data.map(staff => ({
            ...staff,
            id: staff.user_id 
          }))
        : [];

      res.render("admin/staff", { layout: "admin", staffList: staffList });
    } catch (error) {
      console.error(error); // Nên log lỗi ra để debug
      res.render("admin/staff", { layout: "admin", error: "Lỗi tải nhân viên" });
    }
  }
  async addStaff(req, res) {
    try {
      // Gửi dữ liệu từ form sang Backend API
      await axios.post(`${API_URL}/staff`, {
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number
      });
      res.redirect("/admin/staff");
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      res.send("Lỗi thêm nhân viên: " + msg);
    }
  }

  async updateStaff(req, res) {
    try {
      const id = req.params.id;
      // Xử lý checkbox active (nếu tick -> 'on', không tick -> undefined)
      const isActive = req.body.is_active === 'on';
      
      await axios.put(`${API_URL}/staff/${id}`, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        is_active: isActive
      });
      res.redirect("/admin/staff");
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      res.send("Lỗi cập nhật nhân viên: " + msg);
    }
  }

  async deleteStaff(req, res) {
    try {
      await axios.delete(`${API_URL}/staff/${req.params.id}`);
      res.redirect("/admin/staff");
    } catch (error) {
      res.send("Lỗi xóa nhân viên: " + (error.response?.data?.error || error.message));
    }
  }
  

  // --- ROOMS (MỚI) ---
  async getRooms(req, res) {
    try {
      // Lấy danh sách phòng và loại phòng để hiển thị dropdown
      const [roomsRes, typesRes] = await Promise.all([
        axios.get(`${API_URL}/rooms`),
        axios.get(`${API_URL}/room-types`)
      ]);

      const rooms = roomsRes.data.map(room => ({
        ...room,
        price_formatted: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price_per_night),
        is_available: room.status === 'available',
        is_active_checked: room.is_active ? 'checked' : ''
      }));

      res.render("admin/rooms", { 
        layout: "admin", 
        rooms: rooms,
        roomTypes: typesRes.data 
      });
    } catch (error) {
      console.error(error);
      res.render("admin/rooms", { layout: "admin", error: "Lỗi tải dữ liệu phòng" });
    }
  }

  async addRoom(req, res) {
    try {
      await axios.post(`${API_URL}/rooms`, {
        room_number: req.body.room_number,
        room_type_id: parseInt(req.body.room_type_id),
        floor: parseInt(req.body.floor),
        price_per_night: parseFloat(req.body.price_per_night),
        description: req.body.description
      });
      res.redirect("/admin/rooms");
    } catch (error) {
      res.send("Lỗi thêm phòng: " + error.message);
    }
  }

  async updateRoom(req, res) {
    try {
      await axios.put(`${API_URL}/rooms/${req.params.id}`, {
        room_number: req.body.room_number,
        room_type_id: parseInt(req.body.room_type_id),
        floor: parseInt(req.body.floor),
        price_per_night: parseFloat(req.body.price_per_night),
        description: req.body.description,
        status: req.body.status,
        is_active: req.body.is_active === 'on'
      });
      res.redirect("/admin/rooms");
    } catch (error) {
      res.send("Lỗi cập nhật phòng: " + error.message);
    }
  }

  async deleteRoom(req, res) {
    try {
      await axios.delete(`${API_URL}/rooms/${req.params.id}`);
      res.redirect("/admin/rooms");
    } catch (error) {
      res.send("Lỗi xóa phòng (Có thể phòng đang có đơn đặt): " + error.message);
    }
  }
}

export default new AdminController();