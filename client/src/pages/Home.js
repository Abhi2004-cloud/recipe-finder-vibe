import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Amazing Recipes
          </Typography>
          <Typography variant="h5" paragraph>
            Find, create, and share your favorite recipes with the world
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate(user ? '/create-recipe' : '/register')}
          >
            {user ? 'Create Recipe' : 'Get Started'}
          </Button>
        </Container>
      </Box>

      {/* Featured Recipes Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Featured Recipes
        </Typography>
        <Grid container spacing={4}>
          {/* Example featured recipes - you would fetch these from your API */}
          {[1, 2, 3].map((item) => (
            <Grid item key={item} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/recipes/1')}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`/uploads/recipe${item}.jpg`}
                  alt="Recipe"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Delicious Recipe {item}
                  </Typography>
                  <Typography>
                    A mouthwatering dish that will delight your taste buds.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom align="center">
                Search Recipes
              </Typography>
              <Typography align="center">
                Find recipes by ingredients, cuisine, or dietary preferences
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom align="center">
                Create & Share
              </Typography>
              <Typography align="center">
                Share your culinary creations with the community
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom align="center">
                Save Favorites
              </Typography>
              <Typography align="center">
                Keep track of your favorite recipes
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 