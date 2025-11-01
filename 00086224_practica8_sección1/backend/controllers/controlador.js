
import { pool } from "../data/conexion.js";
import bcrypt from 'bcrypt';

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

const createUser = async (request, response) => {
    console.log('createUser request.body =', request.body);

    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).json({ message: 'Faltan campos: nombre, email o contrasenia' });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        [name, email, hashedPassword], (error, results) => {
            if (error) {
                console.error("Error al obtener usuarios:", error);
                response.status(500).json({ error: "Error interno del servidor" });
                return;
            }
            response.status(200).json("Se ha realizado la insercion con exito. " + results.rows);
        });
};

const updateUser = async (request, response) => {
    console.log('createUser request.body =', request.body);

    const { name, email, password } = request.body;
    const id = parseInt(request.params.id);

    if (password) {

        const hashedPassword = await bcrypt.hash(String(password), 10);

        pool.query("UPDATE users SET name = $2, email = $3, password = $4 WHERE id = $1", [id, name, email, hashedPassword], (error, results) => {
            if (error) {
                console.error("Error al actualizar el usuario:", error);
                response.status(500).json({ error: "Error interno del servidor" });
                return;
            }
            response.status(200).json("Se ha realizado la actualizacion en todos los campos. " + results.rows);
        });
    } else {
        pool.query("UPDATE users SET name = $2, email = $3 WHERE id = $1", [id, name, email], (error, results) => {
            if (error) {
                console.error("Error al actualizar el usuario:", error);
                response.status(500).json({ error: "Error interno del servidor" });
                return;
            }
            response.status(200).json("Se ha realizado la actualizacion en los campos nombre y email" + results.rows);
        });
    }
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
        if (error) {
            console.error("Error al eliminar el usuario:", error);
            response.status(500).json({ error: "Error interno del servidor" });
            return;
        }
        response.status(200).json("Se ha realizado la eliminacion del usuario. " + results.rows);
    });
};

export default {
    getUsers,
    getUsersById,
    createUser,
    updateUser,
    deleteUser
};