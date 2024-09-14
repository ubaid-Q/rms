import * as React from 'react';
import { Badge, Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { tableStatus } from '@/models';

export function Table({ status, onClick, tableNo }: { status; onClick?: any; tableNo }) {
  return (
    <Grid
      item
      xs={12}
      sm={4}
      md={4}
      style={{
        padding: 15,
        paddingTop: 30,
        width: '100%',
      }}
    >
      <Badge
        badgeContent={status}
        color={tableStatus[status]}
        style={{ width: '100%', backgroundColor: 'white' }}
        onClick={onClick}
      >
        <Box
          borderRadius={2}
          className=""
          style={{
            width: '100%',
            padding: '10px',
            display: 'flex',
            border: 'solid',
            borderColor: 'gray',
            borderWidth: '0.1px',
          }}
        >
          <Typography variant="h3" style={{ width: 'fit-content' }}>
            {tableNo}
          </Typography>
          <Image
            src={'/tableIcon.jpg'}
            height={100}
            width={120}
            alt="..."
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          />
        </Box>
      </Badge>
    </Grid>
  );
}
