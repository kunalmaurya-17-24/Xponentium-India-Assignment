import React, { useState, useEffect } from 'react';

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/expenses`);
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError('Failed to fetch expenses');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid description and amount');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, amount: parseFloat(amount) })
      });
      if (!response.ok) {
        throw new Error('Failed to add expense');
      }
      const newExpense = await response.json();
      setExpenses([...expenses, newExpense]);
      setDescription('');
      setAmount('');
      setError('');
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete expense');
      }
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditDescription(expense.description);
    setEditAmount(expense.amount);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: editDescription, amount: parseFloat(editAmount) })
      });
      if (!response.ok) throw new Error('Failed to update expense');
      const updatedExpense = await response.json();
      setExpenses(expenses.map(exp => exp.id === id ? updatedExpense : exp));
      setEditingId(null);
      setEditDescription('');
      setEditAmount('');
    } catch (err) {
      setError('Failed to update expense');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 mr-2 rounded"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Expense
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <ul className="space-y-2">
        {expenses.map((expense) => (
          <li key={expense.id} className="flex justify-between items-center p-2 border rounded">
            {editingId === expense.id ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="border p-2 rounded"
                />
                <button
                  onClick={() => handleUpdate(expense.id)}
                  className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span>{expense.description}: ${expense.amount.toFixed(2)}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;