import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import route from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      eq: (a, b) => a === b,
      sum: (a, b) => a + b,
      formatCurrency: (value) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value),
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

route(app);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});