import express from "express";
import { getLogin, getRegister, logout } from "../controllers/authController.js";

const router = express.Router();

function redirectIfLoggedIn(req, res, next) {
	if (req.session.user) return res.redirect("/");
	next();
}

router.get("/login", redirectIfLoggedIn, getLogin);
router.get("/register", redirectIfLoggedIn, getRegister);

router.post("/save-session", async (req, res) => {
  const { username, password } = req.body;

  try {
    const apiRes = await fetch("http://backend:3000/api/customers");
    const users = await apiRes.json();

    const user = users.find(
      u => u.username === username &&
           u.password_hash === password &&
           u.is_active &&
           !u.is_staff
    );

    if (!user) return res.json({ success: false, error: "Sai tài khoản hoặc mật khẩu" });

    req.session.user = user;
    res.json({ success: true });

  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.json({ success: false, error: "Lỗi kết nối Backend" });
  }
});

router.get("/logout", logout);

export default router;