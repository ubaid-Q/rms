import * as React from 'react';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { config } from '@/config/config';

export default function MenuItem({ item, setOrder, order, darkMode = false }) {
  const [quantity, setQuantity] = useState(0);
  const theme = useTheme();

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  React.useEffect(() => {
    setQuantity(order[item.id] ?? 0);
  }, [item.id]);

  React.useEffect(() => {
    if (quantity > 0) {
      setOrder((prev: any) => ({ ...prev, [item.id]: quantity }));
    }
    if (!quantity) {
      setOrder((prev: any) => {
        delete prev[item.id];
        return prev;
      });
    }
  }, [quantity]);

  return (
    <Card
      sx={{
        borderRadius: '20px',
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: darkMode ? theme.palette.background.paper : 'white',
      }}
      className={'=====================' + item.id}
      elevation={0}
    >
      <CardMedia
        component="img"
        height="194"
        image={`http://${window.location.hostname === '.' ? config.host : window.location.hostname}:5000/${item.image}`}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing style={{ justifyContent: 'space-between' }}>
        <IconButton aria-label="Decrease Quantity" onClick={decreaseQuantity}>
          <RemoveIcon />
        </IconButton>
        <Typography variant="body1">{quantity}</Typography>
        <IconButton aria-label="Increase Quantity" onClick={increaseQuantity}>
          <AddIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
