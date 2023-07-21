import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const MerchantSkeleton = () => {

    const random = Math.floor(Math.random() * (160 - 20 + 1)) + 20;

  return (
    <Stack spacing="1.5rem" width="100%">
      <Skeleton animation="wave" variant="circular" width={60} height={60} />
      <Skeleton animation="wave" variant="rectangular" width="80%" height={random} />
      <Skeleton animation="wave" variant="rounded" width="90%" height={40} />
    </Stack>
  );
}

export default MerchantSkeleton;