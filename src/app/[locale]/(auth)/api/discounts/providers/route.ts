import { catchError } from '../../serviceHelpers';
import { getAllProviders } from '../discountServices';

export const GET = async () => {
  try {
    const discountsResponse = await getAllProviders();

    return discountsResponse;
  } catch (error: any) {
    return catchError(error);
  }
};
