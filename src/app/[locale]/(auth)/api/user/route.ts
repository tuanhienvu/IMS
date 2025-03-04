import type { NextRequest } from 'next/server';

import { getUsers } from './userServices';

export const GET = async (request: NextRequest) => {
  return getUsers(request);
};
