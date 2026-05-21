import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "cookcraft",
});

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Check if email exists
    const [emailRows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (emailRows.length === 0) {
      return NextResponse.json({ success: false, error: "Email not found" });
    }

    // Check if password matches
    const [userRows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ success: false, error: "Incorrect password" });
    }

    const user = userRows[0];

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
