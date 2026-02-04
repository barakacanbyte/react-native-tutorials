import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

//middleware
app.use(express.json());

const PORT = process.env.PORT;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database", error);
    process.exit(1);
  }
}

// APIs
//get transactions by id
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${userId}`;
    console.log(transactions);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Failed to get transactions", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get stats
app.get("/api/transactions/summary/:userId", async (req, res) => {
  try {
    const {userId} = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
    `

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `
    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0
    `

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense
    })
  }catch (error) {
    console.error("Failed to get stats", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

//create transaction
app.post("/api/transactions", async (req, res) => {
  //title, amount, category, user_id
  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || amount == undefined || !category || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
      `;
    console.log(transaction);
    res.status(200).json(transaction[0]);
  } catch (error) {
    console.error("Failed to create transaction", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete transaction
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "Invalid transaction id" });
    } 

    const transaction = await sql`SELECT * FROM transactions WHERE id = ${id}`;
    if (transaction.length === 0) {
      throw new Error("Transaction not found");
    }

    console.log(transaction);

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Failed to delete transaction", error);

    if (error.message === "Transaction not found") {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and running on PORT:${PORT}`);
  });
});
