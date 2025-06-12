import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample endpoint
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from server!', data: [1, 2, 3] });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
