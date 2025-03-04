import { NextRequest, NextResponse } from "next/server";
import { Env } from '@/libs/Env';

export const GET = async (request: NextRequest) => {
  try {
    let url = `${Env.API_ICCECO_URL}/InsurTech/CarManafacture`;
    const response = await fetch(`${url}`, {
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
