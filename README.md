# Recipe Finder Vibe

A MERN stack application for finding, creating, and sharing recipes.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abhi2004-cloud/recipe-finder-vibe.git
   cd recipe-finder-vibe
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

## Configuration

1. Start MongoDB:
   - Make sure MongoDB is installed and running on your system
   - Default connection string: `mongodb://localhost:27017/recipefindervibe`

2. Create uploads directory:
   ```bash
   mkdir server/uploads
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```
   The server will run on http://localhost:5000

2. Start the frontend (in a new terminal):
   ```bash
   cd client
   npm start
   ```
   The frontend will open automatically in your browser at http://localhost:3000

## Features

- User authentication (Register/Login)
- Create, read, update, and delete recipes
- Upload recipe images
- View all recipes
- Search and filter recipes
- Responsive design

## Technologies Used

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Image Upload: Multer

## Note

Make sure both MongoDB and the server are running before accessing the frontend application.

## Project Structure

```
recipe-finder/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/               # React components and logic
│       ├── components/    # Reusable components
│       ├── context/       # React context
│       ├── pages/         # Page components
│       └── App.js         # Main App component
├── server/                # Express backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── uploads/          # Recipe images
│   └── server.js         # Server entry point
└── README.md             # Project documentation
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Recipes
- GET /api/recipes - Get all recipes
- GET /api/recipes/:id - Get a single recipe
- POST /api/recipes - Create a new recipe
- PUT /api/recipes/:id - Update a recipe
- DELETE /api/recipes/:id - Delete a recipe

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

 