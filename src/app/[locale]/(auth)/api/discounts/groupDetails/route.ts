import type { NextRequest } from 'next/server';

import { catchError } from '../../serviceHelpers';
import { createDiscountGroup, getDiscountsGroupDetail } from '../discountServices';

// url: /discounts/detail?discountGroupId=1
export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const discountGroupId = Number(searchParams.get('discountGroupId') || '0');
    const discountsResponse = await getDiscountsGroupDetail(discountGroupId);

    return discountsResponse;
  } catch (error: any) {
    return catchError(error);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const discountResponse = await createDiscountGroup(request);

    return discountResponse;
  } catch (error: any) {
    return catchError(error);
  }
};
