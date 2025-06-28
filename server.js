const express = require("express");
const cors = require("cors");
const { Expense } = require("./db");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const { description, amount } = req.body;
    if (!description || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid description or amount" });
    }
    const expense = await Expense.create({
      description,
      amount: parseFloat(amount),
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: "Failed to create expense" });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { description, amount } = req.body;
    if (!description || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid description or amount" });
    }
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    expense.description = description;
    expense.amount = parseFloat(amount);
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    await expense.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

// Start server only if this module is run directly (not required by tests)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app;