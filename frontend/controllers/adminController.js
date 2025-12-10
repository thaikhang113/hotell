import axios from "axios";

const API_URL = "http://217.216.72.223:3000/api/staff";

class AdminController {
  // [GET] /admin/staff - Xem danh sách
  async listStaff(req, res) {
    try {
      const response = await axios.get(API_URL);
      // Đảm bảo mỗi item có thuộc tính `id` (một số API trả `_id`)
      const staffData = Array.isArray(response.data)
        ? response.data.map((item) => ({
            ...item,
            // Một số API trả id dưới tên khác: id, _id, staff_id, user_id, staffId
            id:
              item.id ||
              item._id ||
              item.staff_id ||
              item.user_id ||
              item.staffId ||
              "",
          }))
        : [];

      // Ghi log mẫu dữ liệu để debug khi thiếu id
      console.log(
        "[DEBUG listStaff] Received",
        staffData.length,
        "items. Sample:",
        staffData[0]
      );

      res.render("admin/staff", {
        layout: "admin", // Sử dụng layout admin vừa tạo
        staffList: staffData,
      });
    } catch (error) {
      console.error(error);
      res.render("admin/staff", {
        layout: "admin",
        error: "Lỗi không gọi được API",
      });
    }
  }

  // [POST] /admin/staff/add - Thêm mới
  // [POST] /admin/staff/add
  async addStaff(req, res) {
    try {
      console.log("--- BẮT ĐẦU GỬI DỮ LIỆU ---");
      console.log("Body nhận từ Form:", req.body);

      const payload = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
      };

      const response = await axios.post(API_URL, payload);
      console.log("--- THÊM THÀNH CÔNG ---");
      res.redirect("/admin/staff");
    } catch (error) {
      console.log("--- CÓ LỖI XẢY RA ---");
      if (error.response) {
        // Server API trả về lỗi (400, 409, 500...)
        console.log("Status Code:", error.response.status);
        console.log("Thông báo lỗi từ API:", error.response.data); // <--- QUAN TRỌNG NHẤT
      } else if (error.request) {
        // Không nhận được phản hồi
        console.log("Không nhận được phản hồi từ server API.");
      } else {
        // Lỗi setup code
        console.log("Lỗi code:", error.message);
      }
      res.send(
        "Lỗi khi thêm: " +
          (error.response?.data?.message ||
            JSON.stringify(error.response?.data) ||
            error.message)
      );
    }
  }

  // [POST] /admin/staff/edit/:id - Cập nhật
  // [POST] /admin/staff/edit/:id
  async updateStaff(req, res) {
    const id = req.params.id;

    // 1. Ghi log kiểm tra ID và Body nhận được từ Form
    console.log(`[DEBUG UPDATE] ID nhận được từ URL: ${id}`);
    console.log("[DEBUG UPDATE] Body từ Form:", req.body);

    if (!id) {
      console.error("Lỗi: Không tìm thấy ID để cập nhật.");
      return res.send(
        "Lỗi: Không tìm thấy ID nhân viên. Vui lòng kiểm tra lại link Form."
      );
    }

    try {
      // 1. Xử lý checkbox (Form HTML gửi 'on' hoặc undefined) -> đổi thành true/false
      const isActive = req.body.is_active === "on" ? true : false;

      // 2. Tạo body đúng cấu trúc API yêu cầu
      const updateData = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        is_active: isActive,
      };

      console.log(
        `[DEBUG UPDATE] Payload gửi đi (PUT ${API_URL}/${id}):`,
        updateData
      );

      // 3. Gọi API phương thức PUT
      await axios.put(`${API_URL}/${id}`, updateData);

      console.log("Cập nhật thành công!");
      res.redirect("/admin/staff");
    } catch (error) {
      console.log("--- CÓ LỖI XẢY RA KHI CẬP NHẬT ---");
      if (error.response) {
        // API trả về lỗi
        console.error("Status Code:", error.response.status);
        console.error("Thông báo lỗi từ API:", error.response.data);
        res.send(
          `Lỗi cập nhật (API trả về ${error.response.status}): ` +
            (error.response.data?.message ||
              JSON.stringify(error.response.data))
        );
      } else if (error.request) {
        // Không nhận được phản hồi (Lỗi mạng hoặc server API down)
        console.error("Không nhận được phản hồi từ server API.");
        res.send("Lỗi cập nhật: Không kết nối được với API Server.");
      } else {
        // Lỗi code
        console.error("Lỗi code:", error.message);
        res.send("Lỗi cập nhật: Lỗi trong code Controller: " + error.message);
      }
    }
  }

  // [GET] /admin/staff/delete/:id - Xóa
  async deleteStaff(req, res) {
    const id = req.params.id;

    // 1. Ghi log kiểm tra ID nhận được từ URL
    console.log(`[DEBUG DELETE] ID xóa nhận được từ URL: ${id}`);

    if (!id) {
      console.error("Lỗi: Không tìm thấy ID để xóa.");
      return res.send(
        "Lỗi: Không tìm thấy ID nhân viên. Vui lòng kiểm tra lại link Xóa."
      );
    }

    try {
      // 2. Gọi API phương thức DELETE
      await axios.delete(`${API_URL}/${id}`);

      console.log(`Xóa thành công nhân viên ID: ${id}`);
      res.redirect("/admin/staff");
    } catch (error) {
      console.log("--- CÓ LỖI XẢY RA KHI XÓA ---");
      if (error.response) {
        // API trả về lỗi
        console.error("Status Code:", error.response.status);
        console.error("Thông báo lỗi từ API:", error.response.data);
        res.send(
          `Lỗi khi xóa (API trả về ${error.response.status}): ` +
            (error.response.data?.message ||
              JSON.stringify(error.response.data))
        );
      } else if (error.request) {
        // Không nhận được phản hồi
        console.error("Không nhận được phản hồi từ server API.");
        res.send("Lỗi khi xóa: Không kết nối được với API Server.");
      } else {
        // Lỗi code
        console.error("Lỗi code:", error.message);
        res.send("Lỗi khi xóa: Lỗi trong code Controller: " + error.message);
      }
    }
  }
}

export default new AdminController();
