import { NextResponse } from 'next/server';

import { syncUsers } from '../userServices';

export const POST = async () => {
  try {
    const total = await syncUsers();

    const json_response = {
      status: 'success',
      total,
    };

    return NextResponse.json(json_response);
  } catch (error: any) {
    const error_response = {
      status: 'error',
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
