import React, { useState } from "react";
import { Typography, Slide, Box } from "@mui/material";
import { DeleteRounded as DeleteIcon } from "@mui/icons-material";
import {
  ActionButton,
  Description,
  ProductImage,
  StyledCard,
  StyledCardContent,
  StyledTypography,
  TextContainer,
} from "./styles";

export default function OrderItem({ item, onConfirmDelete }: any) {
  const [isDelete, setIsDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    onConfirmDelete(item, setConfirmDelete);
    setIsDelete(false);
  };

  const handleCancelDelete = () => {
    setIsDelete(false);
  };

  return (
    <Slide direction="down" in={!confirmDelete} mountOnEnter unmountOnExit>
      <StyledCard elevation={0}>
        <StyledCardContent>
          <ProductImage
            src={`http://${window.location.hostname}:5000/${item.menuItem.image}`}
            alt="Product"
            className={isDelete ? "dimmed" : ""}
          />
          <TextContainer className={isDelete ? "dimmed" : ""}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "80%",
                alignItems: "center",
              }}
            >
              <StyledTypography variant="h6">
                {item.menuItem.name}
              </StyledTypography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                <strong>Rs:</strong> {item.price}/-
              </Typography>
            </Box>
            <Description variant="body2" color="text.secondary" gutterBottom>
              {item.menuItem.description}
            </Description>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Price:</strong> {item.menuItem.price}
              <strong> Quantity:</strong> {item.quantity}
            </Typography>
          </TextContainer>

          {isDelete ? (
            <div>
              <ActionButton onClick={handleCancelDelete} isCancel>
                Cancel
              </ActionButton>
              <ActionButton onClick={handleDelete}>Confirm</ActionButton>
            </div>
          ) : (
            <ActionButton onClick={() => setIsDelete(true)}>
              <DeleteIcon />
            </ActionButton>
          )}
        </StyledCardContent>
      </StyledCard>
    </Slide>
  );
}
