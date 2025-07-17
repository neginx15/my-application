import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, catchAsync } from './middleware/errorHandler';
import { NotFoundError, InternalServerError } from './errors';

const app = express();
const PORT = process.env.PORT || 3000;

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Read JSON file
const dataPath = path.join(__dirname, 'data.json');

// Get all items
app.get('/api/items', catchAsync(async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData.items);
  } catch (error) {
    throw new InternalServerError('Failed to fetch items');
  }
}));

// Get single item by ID
app.get('/api/items/:id', catchAsync(async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const jsonData = JSON.parse(data);
    const item = jsonData.items.find((item: any) => item.id === parseInt(req.params.id));
    
    if (!item) {
      throw new NotFoundError(`Item with ID ${req.params.id} not found`);
    }
    
    res.json(item);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Failed to fetch item');
  }
}));

// 404 handler for undefined routes
app.use((req: Request, res: Response, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Error handling middleware
app.use(errorHandler);

// Start server only if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
