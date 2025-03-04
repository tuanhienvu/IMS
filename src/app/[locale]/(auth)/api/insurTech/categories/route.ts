import type { NextRequest } from 'next/server';

import { getCategories } from './categoryService';

export const GET = async (request: NextRequest) => {
  return getCategories(request);
};
