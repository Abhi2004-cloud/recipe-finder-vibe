import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      setRecipe(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error loading recipe');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`http://localhost:5000/api/recipes/${id}`);
        navigate('/recipes');
      } catch (error) {
        setError('Error deleting recipe');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !recipe) {
    return (
      <Container>
        <Alert severity="error">{error || 'Recipe not found'}</Alert>
      </Container>
    );
  }

  const isOwner = user && user.id === recipe.createdBy._id;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1" gutterBottom>
            {recipe.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            By {recipe.createdBy.username}
          </Typography>
          
          {isOwner && (
            <Box sx={{ mb: 4 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/recipes/${id}/edit`)}
                sx={{ mr: 2 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          )}

          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>
              {recipe.description}
            </Typography>
          </Paper>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Ingredients
                </Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={ingredient.name}
                        secondary={ingredient.quantity}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Instructions
                </Typography>
                <List>
                  {recipe.instructions.map((instruction, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`Step ${instruction.step}`}
                          secondary={instruction.description}
                        />
                      </ListItem>
                      {index < recipe.instructions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box
              component="img"
              src={`http://localhost:5000/uploads/${recipe.image}`}
              alt={recipe.title}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 1,
                mb: 2,
              }}
            />
            <Typography variant="h6" gutterBottom>
              Recipe Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Cuisine"
                  secondary={recipe.cuisine}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Prep Time"
                  secondary={`${recipe.prepTime} minutes`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Cook Time"
                  secondary={`${recipe.cookTime} minutes`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Servings"
                  secondary={recipe.servings}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeDetail; 