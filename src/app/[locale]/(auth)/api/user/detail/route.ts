import type { NextRequest } from 'next/server';

import { editActiveUser, getUserDetail } from '../userServices';

export const GET = async (request: NextRequest) => {
  return getUserDetail(request);
};

export const POST = async (request: NextRequest) => {
  return editActiveUser(request);
};
