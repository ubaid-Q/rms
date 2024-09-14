import { styled } from '@mui/system';
import { Card, CardContent, Theme, Typography } from '@mui/material';

export const StyledCard = styled(Card)({
  borderRadius: '20px',
  margin: 10,
  width: '-webkit-fill-available',
  backgroundColor: '#ffffff',
  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&.deleting': {
    opacity: 0.5,
  },
});

export const StyledCardContent = styled(CardContent)({
  padding: '24px',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
});

export const ProductImage = styled('img')({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '20px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

export const TextContainer = styled('div')({
  flex: 1,
});

export const StyledTypography = styled(Typography)({
  textTransform: 'capitalize',
  marginBottom: '8px',
});

export const Description = styled(Typography)({
  marginBottom: '8px',
});

export const ActionButton = styled('button')(({ theme, isCancel }: { theme?: Theme; isCancel?: boolean }) => ({
  border: 'none',
  backgroundColor: isCancel ? theme?.palette.warning.main : '#ff4d4d',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  right: isCancel ? 'auto' : 0,
  left: isCancel ? 0 : 'auto',
  top: 0,
  bottom: 0,
  zIndex: 1,
  '&:hover': {
    backgroundColor: isCancel ? theme?.palette.warning.dark : '#ff6666',
    transform: 'translateY(-2px)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
}));
