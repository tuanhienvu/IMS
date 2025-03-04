import { catchError } from '../serviceHelpers';
import { getDiscountPresets } from './discountServices';

// url: /discounts -- all discount
export const GET = async () => {
  try {
    const discountsResponse = await getDiscountPresets();

    return discountsResponse;
  } catch (error: any) {
    return catchError(error);
  }
};
