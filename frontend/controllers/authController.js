export const getLogin = (req, res) => {
    res.render("auth/login", {
        title: "Đăng nhập",
        scripts: true 
    });
};

export const getRegister = (req, res) => {
  res.render("auth/register", { title: "Đăng ký" });
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};