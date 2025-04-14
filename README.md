# Recipe Finder

A full-stack web application that allows users to search for, create, and share recipes. Built with the MERN stack (MongoDB, Express.js, React.js, and Node.js).

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete recipes
- Search recipes by title, description, or cuisine
- Upload recipe images
- Detailed recipe view with ingredients and instructions
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd recipe-finder
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Configuration

1. Create a `.env` file in the server directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipefindervibe
JWT_SECRET=your-secret-key
```

2. Make sure MongoDB is running on your local machine.

## Running the Application

1. Start the server:
```bash
cd server
npm start
```

2. Start the client:
```bash
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

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

## Technologies Used

- Frontend:
  - React.js
  - Material-UI
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication
  - Multer (file upload)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

 