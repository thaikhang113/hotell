// InvoiceController.js (Đã tối ưu hóa xử lý số tiền)
import axios from "axios";

const API_URL = "http://217.216.72.223:3000/api/invoices";

class InvoiceController {
  async listInvoices(req, res) {
    try {
      const response = await axios.get(API_URL);
      let totalFinalAmount = 0;

      const invoiceData = Array.isArray(response.data)
        ? response.data.map((item) => {
            // XỬ LÝ CHUỖI TIỀN TỆ: '10137600.00' -> 10137600.00
            let rawFinalAmount = String(item.final_amount || "0");

            // Chỉ loại bỏ dấu phẩy (nếu có) để giữ lại dấu chấm thập phân
            rawFinalAmount = rawFinalAmount.replace(/,/g, "");

            const finalAmountValue = parseFloat(rawFinalAmount);

            if (!isNaN(finalAmountValue)) {
              totalFinalAmount += finalAmountValue;
            }

            const isPaid = item.payment_status === "paid";
            const isUnpaid = item.payment_status === "unpaid";

            // Định dạng tiền VND cho từng dòng
            const final_amount_formatted = new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(finalAmountValue);

            // Đảm bảo các trường khác cũng được làm sạch trước khi format
            const total_room_cost_formatted = new Intl.NumberFormat(
              "vi-VN"
            ).format(
              parseFloat(String(item.total_room_cost || 0).replace(/,/g, ""))
            );
            const total_service_cost_formatted = new Intl.NumberFormat(
              "vi-VN"
            ).format(
              parseFloat(String(item.total_service_cost || 0).replace(/,/g, ""))
            );

            return {
              ...item,
              id: item.invoice_id || item._id || "",
              issue_date_short: item.issue_date
                ? new Date(item.issue_date).toLocaleDateString("vi-VN")
                : "N/A",

              final_amount_formatted,
              total_room_cost_formatted,
              total_service_cost_formatted,

              isPaid,
              isUnpaid,
            };
          })
        : [];

      // Định dạng TỔNG SỐ TIỀN để hiển thị ở cuối trang
      const totalFinalAmountFormatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(totalFinalAmount);

      console.log(
        "[DEBUG SUCCESS] Total RAW:",
        totalFinalAmount,
        "| Total FORMATTED:",
        totalFinalAmountFormatted
      );

      // TRUYỀN DỮ LIỆU ĐỂ RENDER
      res.render("admin/invoices", {
        layout: "admin",
        invoiceList: invoiceData,
        totalFinalAmountFormatted: totalFinalAmountFormatted,
      });
    } catch (error) {
      console.error("Lỗi khi xử lý hóa đơn:", error.message);
      res.render("admin/invoices", {
        layout: "admin",
        error: "Lỗi không gọi được API hoặc không có dữ liệu.",
        invoiceList: [],
        totalFinalAmountFormatted: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(0),
      });
    }
  }
}

export default new InvoiceController();
