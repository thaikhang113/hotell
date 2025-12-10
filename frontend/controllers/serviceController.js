// File: controllers/serviceController.js
import axios from "axios";

const API_URL = "http://217.216.72.223:3000/api/services";

class ServiceController {
  // [GET] /admin/services - Xem danh sách
  async listServices(req, res) {
    try {
      const response = await axios.get(API_URL);

      // Đảm bảo mỗi item có thuộc tính 'id' để View sử dụng, lấy từ 'service_id'
      const serviceData = Array.isArray(response.data)
        ? response.data.map((item) => ({
            ...item,
            // Sử dụng service_id làm ID chính
            id: item.service_id || item._id || item.id || "",
            // Định dạng lại giá tiền
            price_formatted: new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(item.price),
          }))
        : [];

      console.log(
        "[DEBUG listServices] Received",
        serviceData.length,
        "items. Sample:",
        serviceData[0]
      );

      res.render("admin/services", {
        layout: "admin",
        serviceList: serviceData, // Đổi tên thành serviceList
      });
    } catch (error) {
      console.error(error);
      res.render("admin/services", {
        layout: "admin",
        error: "Lỗi không gọi được API",
      });
    }
  }

  // [POST] /admin/services/add - Thêm mới
  async addService(req, res) {
    try {
      console.log("--- BẮT ĐẦU GỬI DỮ LIỆU THÊM SERVICE ---");
      console.log("Body nhận từ Form:", req.body);

      // Payload được tạo theo cấu trúc API Service bạn cung cấp
      const payload = {
        service_code: req.body.service_code,
        name: req.body.name,
        // Chuyển đổi giá tiền từ string sang number
        price: parseFloat(req.body.price),
        description: req.body.description,
        availability: true, // Mặc định là có sẵn khi tạo mới
      };

      await axios.post(API_URL, payload);
      console.log("--- THÊM THÀNH CÔNG ---");
      res.redirect("/admin/services");
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
        "Lỗi khi thêm dịch vụ: " +
          (error.response?.data?.message ||
            JSON.stringify(error.response?.data) ||
            error.message)
      );
    }
  }

  // [POST] /admin/services/edit/:id - Cập nhật
  async updateService(req, res) {
    const id = req.params.id; // Đây là service_id

    console.log(`[DEBUG UPDATE] ID (service_id) nhận được từ URL: ${id}`);
    console.log("[DEBUG UPDATE] Body từ Form:", req.body);

    if (!id) {
      console.error("Lỗi: Không tìm thấy ID (service_id) để cập nhật.");
      return res.send("Lỗi: Không tìm thấy ID dịch vụ.");
    }

    try {
      // Xử lý checkbox (Form HTML gửi 'on' hoặc undefined) -> đổi thành true/false
      const isAvailable = req.body.availability === "on" ? true : false;

      // Payload được tạo theo cấu trúc API Service bạn cung cấp
      const updateData = {
        name: req.body.name,
        // Chuyển đổi giá tiền từ string sang number
        price: parseFloat(req.body.price),
        description: req.body.description,
        availability: isAvailable,
      };

      console.log(
        `[DEBUG UPDATE] Payload gửi đi (PUT ${API_URL}/${id}):`,
        updateData
      );

      await axios.put(`${API_URL}/${id}`, updateData);

      console.log("Cập nhật thành công!");
      res.redirect("/admin/services");
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

  // [POST] /admin/services/delete/:id - Xóa
  async deleteService(req, res) {
    const id = req.params.id; // Đây là service_id

    console.log(`[DEBUG DELETE] ID (service_id) xóa nhận được từ URL: ${id}`);

    if (!id) {
      console.error("Lỗi: Không tìm thấy ID (service_id) để xóa.");
      return res.send("Lỗi: Không tìm thấy ID dịch vụ.");
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      console.log(`Xóa thành công dịch vụ ID: ${id}`);
      res.redirect("/admin/services");
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

export default new ServiceController();
