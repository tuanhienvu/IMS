import type { NextRequest } from 'next/server';

import { getRetailOrderDetail, updateRetailOrderStatus } from '../retailOrderServices';

export const GET = async (request: NextRequest) => {
  return getRetailOrderDetail(request);
};

export const POST = async (request: NextRequest) => {
  return updateRetailOrderStatus(request);
};
