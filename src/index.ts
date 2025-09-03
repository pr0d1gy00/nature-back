import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.route"
import { authenticateToken } from "./middleware/authenticateToken";
import productRoutes from "./routes/product.routes";
import path from "path";
import cookieParser from 'cookie-parser';
import { decryptId } from "./services/encryptedId";
import inventoryRoutes from "./routes/inventory.routes"
import storeRoutes from './routes/store.routes'
import dolarRoutes from './routes/dolar.routes';
import commentsRoutes from "./routes/comments.routes";
import orderRoutes from "./routes/order.routes";
import profileRoutes from "./routes/profile.routes";
import "./services/schedulerDolar";

const app = express();

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

interface JwtPayloadInterface extends jwt.JwtPayload {
  email: string;
  id: string;
  role_id: string;
}

app.use(
  cors({
    origin: FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],

  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/nature/auth",authRoutes);
app.use("/api/nature/user", userRoutes );
app.use("/api/nature/category",authenticateToken, categoryRoutes );
app.use("/api/nature/product", productRoutes );
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/nature/comments", commentsRoutes);
app.use("/api/nature/orders", orderRoutes);
app.use("/api/nature/dolar",dolarRoutes);
app.use("/api/nature/inventory",authenticateToken,inventoryRoutes);
app.use("/api/nature/store",storeRoutes);
app.use("/api/nature/profile", profileRoutes);
app.post('/api/verify-token', (req, res) => {
  const token = req.cookies?.token;
  console.log(req.cookies.token)
  console.log(token, 'in verify')
  if (!token) return res.status(401).json({ ok: false });
  try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET no definido");

      const result = jwt.verify(token, secret);
      if (typeof result === "string" || result === null || typeof result !== "object") {
        throw new Error("Token inválido");
      }

      const payload = result as JwtPayloadInterface;
      if (!payload.email || !payload.id || !payload.role_id) {
        throw new Error("Payload incompleto");
      }
    let roleId = payload.role_id as string;
    if (typeof roleId === 'string' && roleId.length > 0) {
      roleId = decryptId(roleId);
    }
    return res.json({ ok: true, role_id: Number(roleId) });
  } catch (err) {
    console.error('verify-token error', err);
    return res.status(401).json({ ok: false });
  }
});

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
