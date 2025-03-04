import type { NextRequest } from 'next/server';
import { ResponseCode } from '@/constants/appConstants';
import { NextResponse } from 'next/server';
import { responseWithError } from '../../serviceHelpers';
import { Env } from '@/libs/Env';

export async function getCategories(request: NextRequest) {
  try {
    const loaisd = request.nextUrl.searchParams.get('loaisd');
    if (!loaisd) {
      return NextResponse.json({
        status: 'success',
        data: [],
      });
    }

    const response = await fetch(`${Env.API_ICCECO_URL}/InsurTech/loai_su_dung?loaisd=${loaisd}`);
    const apiData = await response.json();
    return NextResponse.json({
      status: 'success',
      data: apiData?.data,
    });
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
}
