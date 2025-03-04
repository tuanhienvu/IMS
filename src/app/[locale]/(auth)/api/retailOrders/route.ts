import type { NextRequest } from 'next/server';

import { getRetailOrders } from './retailOrderServices';

export const GET = async (request: NextRequest) => {
  return getRetailOrders(request);
};
