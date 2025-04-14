import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cuisine: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    image: null,
    ingredients: [],
    instructions: [],
  });

  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '' });
  const [newInstruction, setNewInstruction] = useState({ step: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient]
      }));
      setNewIngredient({ name: '', quantity: '' });
    }
  };

  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleAddInstruction = () => {
    if (newInstruction.description) {
      const step = formData.instructions.length + 1;
      setFormData(prev => ({
        ...prev,
        instructions: [...prev.instructions, { ...newInstruction, step }]
      }));
      setNewInstruction({ step: '', description: '' });
    }
  };

  const handleRemoveInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, step: i + 1 }))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    if (!formData.title || !formData.description || !formData.cuisine || 
        !formData.prepTime || !formData.cookTime || !formData.servings) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate numeric fields
    if (isNaN(parseInt(formData.prepTime)) || isNaN(parseInt(formData.cookTime)) || isNaN(parseInt(formData.servings))) {
      setError('Prep time, cook time, and servings must be numbers');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('cuisine', formData.cuisine);
      formDataToSend.append('prepTime', parseInt(formData.prepTime));
      formDataToSend.append('cookTime', parseInt(formData.cookTime));
      formDataToSend.append('servings', parseInt(formData.servings));

      // Add ingredients and instructions as JSON strings
      if (formData.ingredients.length > 0) {
        formDataToSend.append('ingredients', JSON.stringify(formData.ingredients));
      } else {
        setError('Please add at least one ingredient');
        setLoading(false);
        return;
      }

      if (formData.instructions.length > 0) {
        formDataToSend.append('instructions', JSON.stringify(formData.instructions));
      } else {
        setError('Please add at least one instruction');
        setLoading(false);
        return;
      }

      // Add image if present
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Log the data being sent
      console.log('Sending recipe data:', {
        title: formData.title,
        description: formData.description,
        cuisine: formData.cuisine,
        prepTime: parseInt(formData.prepTime),
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        hasImage: !!formData.image
      });

      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a recipe');
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/recipes', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.data) {
        navigate('/recipes');
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Error creating recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="error">Please log in to create a recipe</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Recipe
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Recipe Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Prep Time (minutes)"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Cook Time (minutes)"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Upload Recipe Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {formData.image && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {formData.image.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Ingredient"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={handleAddIngredient} color="primary">
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <List>
                {formData.ingredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={ingredient.name}
                      secondary={ingredient.quantity}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveIngredient(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Instruction"
                    value={newInstruction.description}
                    onChange={(e) => setNewInstruction(prev => ({ ...prev, description: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={handleAddInstruction} color="primary">
                    <AddIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <List>
                {formData.instructions.map((instruction, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Step ${instruction.step}`}
                      secondary={instruction.description}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveInstruction(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Recipe'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRecipe; 