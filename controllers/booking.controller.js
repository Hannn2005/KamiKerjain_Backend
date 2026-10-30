
import pool from "../config/database.js";


export const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM bookings
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT * FROM bookings
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const createBooking = async (req, res) => {
  try {
    const {
      jasaId,
      jasaTitle,
      customerId,
      customerName,
      penyediaId,
      penyediaName,
      price,
      notes,
    } = req.body;

    const result = await pool.query(`
      INSERT INTO bookings (
        jasa_id,
        jasa_title,
        customer_id,
        customer_name,
        penyedia_id,
        penyedia_name,
        price,
        notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      jasaId,
      jasaTitle,
      customerId,
      customerName,
      penyediaId,
      penyediaName,
      price,
      notes ?? null,
    ]);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      status,
      notes,
      reviewText,
      reviewRating,
      completedAt,
    } = req.body;

    const result = await pool.query(`
      UPDATE bookings
      SET
        status = $1,
        notes = $2,
        review_text = $3,
        review_rating = $4,
        completed_at = $5
      WHERE id = $6
      RETURNING * 
    `, [
      status ?? null,
      notes ?? null,
      reviewText ?? null,
      reviewRating ?? null,
      completedAt ?? null,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM bookings
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    let column;

    if (role === "customer") {
      column = "customer_id";
    } else if (role === "penyedia") {
      column = "penyedia_id";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const result = await pool.query(`
      SELECT *
      FROM bookings
      WHERE ${column} = $1
      ORDER BY created_at DESC
    `, [userId]);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
