import axios from "axios";

// API URL của Backend
const API_URL = "http://217.216.72.223:3000/api/services";

class ServiceController {
  // [GET] /admin/services
  async listServices(req, res) {
    try {
      const response = await axios.get(API_URL);
      const serviceData = Array.isArray(response.data)
        ? response.data.map((item) => ({
            ...item,
            id: item.service_id || item._id || item.id || "",
            price_formatted: new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(item.price),
          }))
        : [];

      res.render("admin/services", {
        layout: "admin",
        serviceList: serviceData,
      });
    } catch (error) {
      console.error(error);
      res.render("admin/services", {
        layout: "admin",
        error: "Lỗi không gọi được API",
      });
    }
  }

  // [POST] /admin/services/add
  async addService(req, res) {
    try {
      const payload = {
        service_code: req.body.service_code,
        name: req.body.name,
        price: parseFloat(req.body.price),
        description: req.body.description,
        availability: true,
      };
      await axios.post(API_URL, payload);
      res.redirect("/admin/services");
    } catch (error) {
      res.send("Lỗi thêm dịch vụ: " + (error.response?.data?.message || error.message));
    }
  }

  // [POST] /admin/services/edit/:id
  async updateService(req, res) {
    const id = req.params.id;
    try {
      const isAvailable = req.body.availability === "on" ? true : false;
      const updateData = {
        name: req.body.name,
        price: parseFloat(req.body.price),
        description: req.body.description,
        availability: isAvailable,
      };
      await axios.put(`${API_URL}/${id}`, updateData);
      res.redirect("/admin/services");
    } catch (error) {
      res.send("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
    }
  }

  // [POST] /admin/services/delete/:id
  async deleteService(req, res) {
    try {
      await axios.delete(`${API_URL}/${req.params.id}`);
      res.redirect("/admin/services");
    } catch (error) {
      res.send("Lỗi xóa: " + (error.response?.data?.message || error.message));
    }
  }

  // [GET] /services/proxy-list (MỚI: Dùng cho Modal đặt phòng)
  async getServiceListProxy(req, res) {
    try {
      // Gọi sang backend lấy list services
      const response = await axios.get(`${API_URL}/list`);
      res.json(response.data);
    } catch (error) {
      console.error("Proxy Service Error:", error.message);
      res.status(500).json([]);
    }
  }
}

export default new ServiceController();