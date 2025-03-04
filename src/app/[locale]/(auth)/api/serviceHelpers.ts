import { NextResponse } from 'next/server';

export function responseWithError(message: string, code: number) {
  const error_response = {
    status: 'error',
    message: message || 'Something went wrong!!!',
  };
  return new NextResponse(JSON.stringify(error_response), {
    status: code || 500,
    headers: { 'Content-Type': 'application/json' },
  });
};

export function catchError(error: any) {
  const error_response = {
    status: 'error',
    message: error.message,
  };
  return new NextResponse(JSON.stringify(error_response), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
