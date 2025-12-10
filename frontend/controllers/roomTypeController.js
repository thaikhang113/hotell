// File: controllers/roomTypeController.js

import axios from "axios";

// API URL Room Types
const API_URL = "http://217.216.72.223:3000/api/room-types";

class RoomTypeController {
  // [GET] /admin/room-types - Xem danh sách
  async listRoomTypes(req, res) {
    try {
      const response = await axios.get(API_URL);

      const roomTypeList = Array.isArray(response.data)
        ? response.data.map((item) => ({
            ...item,
            // Đảm bảo id dùng cho route Edit/Delete là room_type_id
            id: item.room_type_id,
          }))
        : [];

      res.render("admin/room-types", {
        layout: "admin",
        roomTypeList: roomTypeList,
      });
    } catch (error) {
      console.error("Lỗi khi gọi API danh sách loại phòng:", error.message);
      res.render("admin/room-types", {
        layout: "admin",
        error: "Lỗi không gọi được API danh sách loại phòng.",
      });
    }
  }

  // [POST] /admin/room-types/add - Thêm mới
  async addRoomType(req, res) {
    try {
      // Payload theo mẫu thêm: { "name": "Premium", "description": "..." }
      const payload = {
        name: req.body.name,
        description: req.body.description || "",
      };

      await axios.post(API_URL, payload);
      res.redirect("/admin/room-types");
    } catch (error) {
      console.error(
        "Lỗi khi thêm loại phòng:",
        error.response?.data || error.message
      );
      res.send(
        "Lỗi khi thêm loại phòng: " + (error.response?.data || error.message)
      );
    }
  }

  // [POST] /admin/room-types/edit/:id - Cập nhật
  async updateRoomType(req, res) {
    const id = req.params.id;

    if (!id) return res.send("Lỗi: Không tìm thấy ID loại phòng.");

    try {
      // is_active: Lấy từ checkbox, 'on' là true, ngược lại là false
      const isActive = req.body.is_active === "on" ? true : false;

      // Payload theo mẫu sửa: { "name": "...", "description": "...", "is_active": true/false }
      const updateData = {
        name: req.body.name,
        description: req.body.description || "",
        is_active: isActive,
      };

      await axios.put(`${API_URL}/${id}`, updateData);

      res.redirect("/admin/room-types");
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật loại phòng:",
        error.response?.data || error.message
      );
      res.send(`Lỗi cập nhật: ` + (error.response?.data || error.message));
    }
  }

  // [POST] /admin/room-types/delete/:id - Xóa
  async deleteRoomType(req, res) {
    const id = req.params.id;
    if (!id) return res.send("Lỗi: Không tìm thấy ID loại phòng để xóa.");

    try {
      await axios.delete(`${API_URL}/${id}`);
      res.redirect("/admin/room-types");
    } catch (error) {
      console.error(
        "Lỗi khi xóa loại phòng:",
        error.response?.data || error.message
      );
      res.send(`Lỗi khi xóa: ` + (error.response?.data || error.message));
    }
  }
}

export default new RoomTypeController();
