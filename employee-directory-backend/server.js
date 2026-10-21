import express from "express";
import pool from "./db.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

// Test database connection
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");
    res.json({ message: "MySQL connected!", result: rows[0].result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Get all employees
app.get("/employees", async (req, res) => {
  try {
    const [employees] = await pool.query("SELECT * FROM employees");
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Create a employee
app.post("/add-employee", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        error: "Name, email and role are required",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO employees (name, email, role) VALUES (?, ?, ?)",
      [name, email, role],
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      role,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists" });
    }

    console.error(error);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

// Update a employee
app.put("/update-employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        error: "Name, email and role are required",
      });
    }

    const [result] = await pool.execute(
      "UPDATE employees SET name = ?, email = ?, role = ? WHERE id = ?",
      [name, email, role, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({
      id,
      name,
      email,
      role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// Delete a employee
app.delete("/delete-employee/:id", async (req, res) =>
  pool
    .execute("DELETE FROM employees WHERE id = ?", [req.params.id])
    .then(() => {
      res.json({ message: "Employee deleted successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to delete employee" });
    }),
);

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
