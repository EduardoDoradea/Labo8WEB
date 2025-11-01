// app.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import controlador from '../backend/controllers/controlador.js';
import { pool } from "../backend/data/conexion.js";

const app = express();
const PORT = 5001;
const JWT_SECRET = "your_jwt_secret";

app.use(bodyParser.json());
app.use(cors());

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

const users = [];

// Rutas
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        
        res.status(200).json({ token });

    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/protected", verifyToken, (req, res) => {
    res.status(200).json({ message: "Protected data accessed", user: req.user });
});

app.get("/users", verifyToken, controlador.getUsers);
app.get("/users/:id", verifyToken, controlador.getUsersById);
app.post("/users", verifyToken, controlador.createUser);
app.put("/users/:id", verifyToken, controlador.updateUser);
app.delete("/users/:id", verifyToken, controlador.deleteUser);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)
);


