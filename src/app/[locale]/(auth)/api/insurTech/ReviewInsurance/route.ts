import { NextRequest, NextResponse } from "next/server";
import { Env } from '@/libs/Env';

export const POST = async (request: NextRequest) => {
  try {
    const requestBody = await request.json();
    const response = await fetch(`${Env.API_ICCECO_URL}/InsurTech/ReviewInsurance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'clientid': Env.ICCECO_CLIENT_ID,
        'clientsecret': Env.ICCECO_CLIENT_SECRET
      },
      body: JSON.stringify(requestBody),
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
