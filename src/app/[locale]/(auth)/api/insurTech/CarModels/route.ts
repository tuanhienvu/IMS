import { NextRequest, NextResponse } from "next/server";
import { Env } from '@/libs/Env';

export const GET = async (request: NextRequest) => {
  try {
    const manufactureId = request.nextUrl.searchParams.get('manufactureId');
    const response = await fetch(`${Env.API_ICCECO_URL}/InsurTech/CarModels?manufactureId=${manufactureId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const responseData = await response.json();
    return NextResponse.json({
      status: 'success',
      data: responseData,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    });
  }
};
