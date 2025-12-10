import express from "express";
import {
	getLogin,
	getRegister,
	logout,
} from "../controllers/authController.js";

const router = express.Router();

// Nếu đã đăng nhập → không vào login/register
function redirectIfLoggedIn(req, res, next) {
	if (req.session.user) return res.redirect("/");
	next();
}

router.get("/login", redirectIfLoggedIn, getLogin);
router.get("/register", redirectIfLoggedIn, getRegister);

// ⭐⭐ LOGIN + KIỂM TRA USER TRÊN DATABASE VPS ⭐⭐
router.post("/save-session", async (req, res) => {
  const { username, password } = req.body;

  const apiRes = await fetch("http://217.216.72.223:3000/api/customers");
  const users = await apiRes.json();

  const user = users.find(
    u => u.username === username &&
         u.password_hash === password &&
         u.is_active &&
         !u.is_staff
  );

  if (!user) return res.json({ success: false, error: "Sai tài khoản hoặc mật khẩu" });

  req.session.user = user;
  console.log("SESSION SAU KHI ĐĂNG NHẬP:", req.session);

  res.json({ success: true });
});
router.get("/logout", logout);

export default router;
