import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Slider,
  Box,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import AXIOS from 'axios';

const AddMovieForm = () => {
  const [movieName, setMovieName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [budget, setBudget] = useState('');
  const [storyline, setStoryline] = useState('');
  const [actors, setActors] = useState([]);
  const [rating, setRating] = useState(0);
  const [platform, setPlatform] = useState('');
  const [poster, setPoster] = useState(null);
  const [trailerLink, setTrailerLink] = useState('');
  const [platformLink, setPlatformLink] = useState('');
  const [genre, setGenre] = useState([]); // Change genre to an array
  const [actorsList, setActorsList] = useState([]); // State to hold the actors list fetched from backend
  const genresList = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'Animation',
    'Documentary',
    'Adventure',
    'Fantasy',
    'Mystery',
    'Crime',
    'Historical',
    'Biography',
    'Family',
    'Musical',
    'War',
    'Western',
    'superhero'
  ];
  

  const maxGenres = 3; // Set the maximum number of genres that can be selected

  // Fetch actors from backend on component mount
  useEffect(() => {
    AXIOS.get('http://localhost:9000/admin/get-artist') // Make sure this API returns a list of actors
      .then((response) => {
        const actorNames = response.data.map((artist) => artist.name); // Assuming each artist has a `name` property
        setActorsList(actorNames);
      })
      .catch((err) => {
        console.log('Error fetching actors:', err);
      });
  }, []);

  const handlePosterUpload = (e) => {
    setPoster(e.target.files[0]);
  };

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append('movieName', movieName);
    formData.append('releaseDate', releaseDate);
    formData.append('budget', budget);
    formData.append('storyline', storyline);
    formData.append('actors', JSON.stringify(actors)); // Convert actors array to string
    formData.append('rating', rating);
    formData.append('platform', platform);
    formData.append('trailerLink', trailerLink);
    formData.append('platformLink', platformLink);
    formData.append('genre', JSON.stringify(genre)); // Send the genres as an array

    if (poster) {
      formData.append('poster', poster);
    }

    AXIOS.post('http://localhost:9000/admin/add-movie', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', height: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Add Movie Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Movie Name"
            variant="outlined"
            fullWidth
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Release Date"
            variant="outlined"
            type="text"
            fullWidth
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            options={genresList}
            value={genre}
            onChange={(event, newValue) => {
              if (newValue.length <= maxGenres) {
                setGenre(newValue); // Set genres only if the selected length is within the limit
              } else {
                alert(`You can select a maximum of ${maxGenres} genres.`);
              }
            }}
            renderInput={(params) => <TextField {...params} label="Genres" />}
            disableCloseOnSelect
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Budget"
            variant="outlined"
            fullWidth
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Storyline"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={storyline}
            onChange={(e) => setStoryline(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            options={actorsList}
            value={actors}
            onChange={(event, newValue) => setActors(newValue)}
            renderInput={(params) => <TextField {...params} label="Cast" />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Rating (Out of 5)</Typography>
          <Slider
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            valueLabelDisplay="auto"
            step={0.5}
            min={0}
            max={5}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Platform</InputLabel>
            <Select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              label="Platform"
            >
              <MenuItem value="Netflix">Netflix</MenuItem>
              <MenuItem value="Hulu">Hulu</MenuItem>
              <MenuItem value="Amazon Prime">Amazon Prime</MenuItem>
              <MenuItem value="Disney+">Disney+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Platform Link"
            variant="outlined"
            fullWidth
            value={platformLink}
            onChange={(e) => setPlatformLink(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Trailer (YouTube Link)"
            variant="outlined"
            fullWidth
            value={trailerLink}
            onChange={(e) => setTrailerLink(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Upload Poster
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handlePosterUpload}
              />
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddMovieForm;
