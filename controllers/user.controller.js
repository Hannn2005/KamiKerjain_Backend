
import pool from "../config/database.js";
import bcrypt from "bcryptjs";


export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM users
      ORDER BY created_at DESC
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data users" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT *
      FROM users
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};


export const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      password,
      role,
      profileImage,
      address,
      description,
    } = req.body;

    if (!username || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: "All field required",
      });
    }

    if (!["customer", "penyedia"].includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(`
      INSERT INTO users (
        username,
        email,
        phone,
        password_hash,
        role,
        profile_image,
        address,
        description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      username,
      email.toLowerCase(),
      phone,
      passwordHash,
      role,
      profileImage ?? null,
      address ?? null,
      description ?? null,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Email sudah digunakan" });
    }

    res.status(500).json({ message: "Gagal membuat user" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus user" });
  }
};
