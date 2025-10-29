
import { pool } from "../data/conexion.js";

const getUsers = (request, response) => {
    pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
        if (error) {
            console.error("Error al obtener usuarios:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results.rows);
    });
};

const getUsersById = (request, response) => {
    const id = parseInt(request.params.id); 
    pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
        if (error) {
            console.error("Error al obtener usuarios:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results.rows);
    });
};

const createUser = (request, response) => {
    const { name, email, password } = request.body;
    pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        [name, email, password], (error, results) => {
        if (error) {
            console.error("Error al obtener usuarios:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results.rows);
    });
};

const updateUser = (request, response) => {
    const { name, email, password } = request.body;
    const id = parseInt(request.params.id);
    pool.query("UPDATE users SET name = $2, email = $3 password = $4 WHERE id = $1", [id, name, email, password], (error, results) => {
        if (error) {
            console.error("Error al obtener usuarios:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results.rows);
    });
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
        if (error) {
            console.error("Error al obtener usuarios:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json(results.rows);
    });
};

export default {
    getUsers,
    getUsersById,
    createUser,
    updateUser, 
    deleteUser
};