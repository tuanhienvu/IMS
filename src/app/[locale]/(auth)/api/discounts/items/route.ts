import type { NextRequest } from 'next/server';

import { catchError } from '../../serviceHelpers';
import { createDiscountItemInGroup, getDiscountPresets, removeDiscountItemInGroup } from '../discountServices';

// url: /discounts -- all discount
export const GET = async () => {
  try {
    const discountsResponse = await getDiscountPresets();

    return discountsResponse;
  } catch (error: any) {
    return catchError(error);
  }
};

// save discount group  /discount discountGroupId=1
// {
//    data.providerId,
//    data.vehicleTypeId,
//    data.discountGroupId,
//    data.percentage
// }
export const POST = async (request: NextRequest) => {
  try {
    const discountResponse = await createDiscountItemInGroup(request);

    return discountResponse;
  } catch (error: any) {
    return catchError(error);
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const discountResponse = await removeDiscountItemInGroup(request);

    return discountResponse;
  } catch (error: any) {
    return catchError(error);
  }
};
