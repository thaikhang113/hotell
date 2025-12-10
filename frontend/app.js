// file: app.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import methodOverride from "method-override";
import morgan from "morgan";
import hbs from "express-handlebars";

// Routers
import route from "./routes/index.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import bookingRouter from "./routes/booking.js";

// Middleware
import checkLogin from "./Middleware/checkLogin.js";

const app = express();
const port = 3001;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================
// 🔧 Template Engine (Handlebars)
// ============================
app.engine(
	"hbs",
	hbs.engine({
		extname: ".hbs",
		defaultLayout: "main",
		layoutsDir: path.join(__dirname, "views/layouts"),
		partialsDir: path.join(__dirname, "views/partials"),
	})
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// ============================
// 🔧 Middleware
// ============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

// ============================
// 🔧 Session Middleware
// ============================
app.use(
	session({
		secret: "keto_secret_key",
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			sameSite: "lax",
			secure: false,
		},
	})
);

// Gửi session sang view
app.use((req, res, next) => {
	res.locals.session = req.session;
	next();
});

// ============================
// 🔧 Router
// ============================
app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/booking", bookingRouter);

// Chặn truy cập nếu chưa đăng nhập (trừ /auth)
app.use((req, res, next) => {
	if (req.path.startsWith("/auth")) return next();
	return checkLogin(req, res, next);
});

// Routes tổng hợp
route(app);

// ============================
// 🚀 Start Server
// ============================
app.listen(port, () => {
	console.log(`Server đang chạy tại http://localhost:${port}`);
});
