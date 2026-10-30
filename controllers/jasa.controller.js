
import pool from "../config/database.js";


export const getAllJasa = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM jasa
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


export const getJasaById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT * FROM jasa
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Jasa not found",
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


export const createJasa = async (req, res) => {
  try {
    const {
      penyediaId,
      penyediaName,
      title,
      description,
      category,
      price,
      location,
      imageUrl,
    } = req.body;

    const result = await pool.query(`
      INSERT INTO jasa (
        penyedia_id,
        penyedia_name,
        title,
        description,
        category,
        price,
        location,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        penyedia_id AS "penyediaId",
        penyedia_name AS "penyediaName",
        title,
        description,
        category,
        price,
        location,
        image_url AS "imageUrl",
        rating,
        total_reviews AS "totalReviews",
        is_active AS "isActive",
        created_at AS "createdAt"
    `, [
      penyediaId,
      penyediaName,
      title,
      description,
      category,
      price,
      location,
      imageUrl ?? null,
    ]);

    return res.status(201).json({
      success: true,
      message: "Jasa created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const updateJasa = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      penyediaName,
      title,
      description,
      category,
      price,
      location,
      imageUrl,
      isActive,
    } = req.body;

    const result = await pool.query(`
      UPDATE jasa
      SET
        penyedia_name = COALESCE($1, penyedia_name),
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        category = COALESCE($4, category),
        price = COALESCE($5, price),
        location = COALESCE($6, location),
        image_url = COALESCE($7, image_url),
        is_active = COALESCE($8, is_active)
      WHERE id = $9
      RETURNING
        id,
        penyedia_id AS "penyediaId",
        penyedia_name AS "penyediaName",
        title,
        description,
        category,
        price,
        location,
        image_url AS "imageUrl",
        rating,
        total_reviews AS "totalReviews",
        is_active AS "isActive",
        created_at AS "createdAt"
    `, [
      penyediaName ?? null,
      title ?? null,
      description ?? null,
      category ?? null,
      price ?? null,
      location ?? null,
      imageUrl ?? null,
      isActive ?? null,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Jasa not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Jasa updated successfully",
      data: result.rows[0],
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteJasa = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM jasa
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Jasa not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Jasa deleted successfully",
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
