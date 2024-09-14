import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Theme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { makeStyles } from '@mui/styles';
import Image from 'next/image';
import { config } from '@/config/config';
import { Delete } from '@mui/icons-material';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '90%',
    margin: 'auto',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)',
    },
  },
  imageContainer: {
    // position: "relative",
    width: '100%',
    height: 400,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    minWidth: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0) 100%)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    color: 'white',
    zIndex: 1,
    padding: theme.spacing(2),
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.7) 100%)',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  description: {
    marginBottom: theme.spacing(1),
  },
  price: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    fontWeight: 'bold',
    color: 'white',
    zIndex: 1,
    background: 'linear-gradient(to right, #FF416C, #FF4B2B)',
    padding: theme.spacing(1),
    borderRadius: 20,
  },
  editButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.3s ease-in-out',
    opacity: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '10%',
    padding: theme.spacing(1),
  },
  deleteButton: {
    color: '#FF4B2B',
  },
  showEditButton: {
    opacity: 1,
  },
  editButton: {
    color: 'white',
  },
}));
interface FoodCardProps {
  data: any;
  onEdit: Function;
  onDelete: Function;
}

const FoodCard = ({ data, onEdit, onDelete }: FoodCardProps) => {
  const classes = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card className={classes.root} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={classes.imageContainer}>
        <img
          className={classes.image}
          src={config.apiHost + '/' + data.image}
          alt={data.name}
          width={'100%'}
          height={'100%'}
        />
        <div className={classes.gradientOverlay} />
        <div className={`${classes.editButtonContainer} ${isHovered ? classes.showEditButton : ''}`}>
          <IconButton className={classes.editButton} aria-label="edit" onClick={() => onEdit(data)}>
            <EditIcon />
          </IconButton>
          <IconButton className={classes.deleteButton} aria-label="edit" onClick={() => onDelete(data)}>
            <Delete />
          </IconButton>
        </div>
      </div>
      <Typography variant="body2" className={classes.price}>
        Rs: {data.price}/-
      </Typography>
      <CardContent className={classes.content}>
        <Typography variant="h6" className={classes.title}>
          {data.name}
        </Typography>
        <Typography variant="body2" className={classes.description}>
          {data.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export { FoodCard };
