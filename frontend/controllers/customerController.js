// File: controllers/customerController.js
import axios from "axios";

const API_URL = "http://217.216.72.223:3000/api/customers";

class CustomerController {
  // [GET] /admin/customers - Xem danh sách
  async listCustomers(req, res) {
    try {
      const response = await axios.get(API_URL);

      // Đảm bảo mỗi item có thuộc tính 'id' để View sử dụng, lấy từ 'user_id'
      const customerData = Array.isArray(response.data)
        ? response.data.map((item) => ({
            ...item,
            id: item.user_id || item._id || item.id || "", // Sử dụng user_id
          }))
        : [];

      console.log(
        "[DEBUG listCustomers] Received",
        customerData.length,
        "items. Sample:",
        customerData[0]
      );

      res.render("admin/customers", {
        layout: "admin",
        customerList: customerData, // Đổi tên thành customerList
      });
    } catch (error) {
      console.error(error);
      res.render("admin/customers", {
        layout: "admin",
        error: "Lỗi không gọi được API",
      });
    }
  }

  // [POST] /admin/customers/add - Thêm mới
  async addCustomer(req, res) {
    try {
      console.log("--- BẮT ĐẦU GỬI DỮ LIỆU THÊM CUSTOMER ---");
      console.log("Body nhận từ Form:", req.body);

      // Payload được tạo theo cấu trúc API Customer bạn cung cấp
      const payload = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        address: req.body.address,
        date_of_birth: req.body.date_of_birth,
        gender: req.body.gender,
        is_active: true, // Mặc định Active khi tạo mới
      };

      await axios.post(API_URL, payload);
      console.log("--- THÊM THÀNH CÔNG ---");
      res.redirect("/admin/customers");
    } catch (error) {
      console.log("--- CÓ LỖI XẢY RA KHI THÊM ---");
      if (error.response) {
        console.error("Status Code:", error.response.status);
        console.error("Thông báo lỗi từ API:", error.response.data);
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server API.");
      } else {
        console.error("Lỗi code:", error.message);
      }
      res.send(
        "Lỗi khi thêm khách hàng: " +
          (error.response?.data?.message ||
            JSON.stringify(error.response?.data) ||
            error.message)
      );
    }
  }

  // [POST] /admin/customers/edit/:id - Cập nhật
  async updateCustomer(req, res) {
    const id = req.params.id; // Đây là user_id

    console.log(`[DEBUG UPDATE] ID (user_id) nhận được từ URL: ${id}`);
    console.log("[DEBUG UPDATE] Body từ Form:", req.body);

    if (!id) {
      console.error("Lỗi: Không tìm thấy ID (user_id) để cập nhật.");
      return res.send("Lỗi: Không tìm thấy ID khách hàng.");
    }

    try {
      const isActive = req.body.is_active === "on" ? true : false;
      const dateOfBirth = req.body.date_of_birth || null;

      // Payload được tạo theo cấu trúc API Customer bạn cung cấp
      const updateData = {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        address: req.body.address,
        date_of_birth: dateOfBirth,
        gender: req.body.gender,
        is_active: isActive,
      };

      console.log(
        `[DEBUG UPDATE] Payload gửi đi (PUT ${API_URL}/${id}):`,
        updateData
      );

      await axios.put(`${API_URL}/${id}`, updateData);

      console.log("Cập nhật thành công!");
      res.redirect("/admin/customers");
    } catch (error) {
      console.log("--- CÓ LỖI XẢY RA KHI CẬP NHẬT ---");
      if (error.response) {
        console.error("Status Code:", error.response.status);
        console.error("Thông báo lỗi từ API:", error.response.data);
        res.send(
          `Lỗi cập nhật (API trả về ${error.response.status}): ` +
            (error.response.data?.message ||
              JSON.stringify(error.response.data))
        );
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server API.");
        res.send("Lỗi cập nhật: Không kết nối được với API Server.");
      } else {
        console.error("Lỗi code:", error.message);
        res.send("Lỗi cập nhật: Lỗi trong code Controller: " + error.message);
      }
    }
  }

  // [POST] /admin/customers/delete/:id - Xóa
  async deleteCustomer(req, res) {
    const id = req.params.id; // Đây là user_id

    console.log(`[DEBUG DELETE] ID (user_id) xóa nhận được từ URL: ${id}`);

    if (!id) {
      console.error("Lỗi: Không tìm thấy ID (user_id) để xóa.");
      return res.send("Lỗi: Không tìm thấy ID khách hàng.");
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      console.log(`Xóa thành công khách hàng ID: ${id}`);
      res.redirect("/admin/customers");
    } catch (error) {
      console.log("--- CÓ LỖI XẢY RA KHI XÓA ---");
      if (error.response) {
        console.error("Status Code:", error.response.status);
        console.error("Thông báo lỗi từ API:", error.response.data);
        res.send(
          `Lỗi khi xóa (API trả về ${error.response.status}): ` +
            (error.response.data?.message ||
              JSON.stringify(error.response.data))
        );
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server API.");
        res.send("Lỗi khi xóa: Không kết nối được với API Server.");
      } else {
        console.error("Lỗi code:", error.message);
        res.send("Lỗi khi xóa: Lỗi trong code Controller: " + error.message);
      }
    }
  }
}

export default new CustomerController();
