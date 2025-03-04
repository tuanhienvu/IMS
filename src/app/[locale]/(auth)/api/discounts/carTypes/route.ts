import { catchError } from '../../serviceHelpers';
import { getAllVehicles } from '../discountServices';

export const GET = async () => {
  try {
    const discountsResponse = await getAllVehicles();

    return discountsResponse;
  } catch (error: any) {
    return catchError(error);
  }
};
