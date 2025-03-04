import type { NextRequest } from 'next/server';

import { exportOrdersCsv } from '../retailOrderServices';

export const GET = async (request: NextRequest) => {
  return exportOrdersCsv(request);
};
