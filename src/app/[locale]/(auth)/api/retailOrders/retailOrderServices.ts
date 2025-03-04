import { ResponseCode } from '@/constants/appConstants';
import { dbRetail as db } from '@/libs/DB';

import { retailOrders } from '@/models/SchemaIcc';
import { TZDate } from '@date-fns/tz';
import { AsyncParser } from '@json2csv/node';
import { parse } from 'date-fns/parse';
import { and, count, desc, eq, gt, like, lt, or } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { responseWithError } from '../serviceHelpers';

export async function getRetailOrders(request: NextRequest) {
  try {
    const page_str = request.nextUrl.searchParams.get('page');
    const limit_str = request.nextUrl.searchParams.get('limit');
    const search_str = request.nextUrl.searchParams.get('search');
    const provider = request.nextUrl.searchParams.get('provider');
    const status = request.nextUrl.searchParams.get('status');
    const startDateStr = request.nextUrl.searchParams.get('startDate') || '';
    const endDateStr = request.nextUrl.searchParams.get('endDate') || '';
    const loaiSanPham = request.nextUrl.searchParams.get('insType');

    const tzone = 'Asia/Ho_Chi_Minh';
    const page = page_str ? Number.parseInt(page_str, 10) : 1;
    const limit = limit_str ? Number.parseInt(limit_str, 10) : 10;
    const skip = (page - 1) * limit;
    console.log(`loaiSanPham: ${endDateStr}`);
    const orders = await db
      .select()
      .from(retailOrders)
      .where(and(
        !search_str
          ? undefined
          : or(
            like(retailOrders.tenChuxe, `%${search_str}%`),
            like(retailOrders.email, `%${search_str}%`),
            like(retailOrders.bienSo, `%${search_str}%`),
            like(retailOrders.id, `%${search_str}%`),
          )
        , !provider ? undefined : like(retailOrders.ncc, provider),
        !status ? undefined : eq(retailOrders.status, status),
        !loaiSanPham ? undefined : eq(retailOrders.loaiSanPham, loaiSanPham),
        !startDateStr.length ? undefined : gt(retailOrders.createdAt, TZDate.tz(tzone, parse(`${startDateStr} 00:00:00`, 'yyyy-MM-dd HH:mm:ss', new Date()))),
        !endDateStr.length ? undefined : lt(retailOrders.createdAt, TZDate.tz(tzone, parse(`${endDateStr} 23:59:59`, 'yyyy-MM-dd HH:mm:ss', new Date()))),
      ),
      )
      .orderBy(desc(retailOrders.createdAt))
      .limit(limit)
      .offset(skip);

    const total = await db
      .select({ count: count() })
      .from(retailOrders)
      .where(and(
        !search_str
          ? undefined
          : or(
            like(retailOrders.tenChuxe, `%${search_str}%`),
            like(retailOrders.email, `%${search_str}%`),
            like(retailOrders.bienSo, `%${search_str}%`),
            like(retailOrders.id, `%${search_str}%`),
          )
        , !provider ? undefined : like(retailOrders.ncc, provider),
        !status ? undefined : eq(retailOrders.status, status),
        !loaiSanPham ? undefined : eq(retailOrders.loaiSanPham, loaiSanPham),
        !startDateStr.length ? undefined : gt(retailOrders.createdAt, TZDate.tz(tzone, parse(`${startDateStr} 00:00:00`, 'yyyy-MM-dd HH:mm:ss', new Date()))),
        !endDateStr.length ? undefined : lt(retailOrders.createdAt, TZDate.tz(tzone, parse(`${endDateStr} 23:59:59`, 'yyyy-MM-dd HH:mm:ss', new Date()))),
      ),
      );

    const json_response = {
      status: 'success',
      orders,
      count: total[0] ? total[0].count : 0,
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

export async function exportOrdersCsv(request: NextRequest) {
  try {
    const search_str = request.nextUrl.searchParams.get('search');
    const provider = request.nextUrl.searchParams.get('provider');
    const status = request.nextUrl.searchParams.get('status');
    const startDateStr = request.nextUrl.searchParams.get('startDate') || '';
    const endDateStr = request.nextUrl.searchParams.get('endDate') || '';
    const loaiSanPham = request.nextUrl.searchParams.get('insType');

    const tzone = 'Asia/Ho_Chi_Minh';

    const orders = await db
      .select()
      .from(retailOrders)
      .where(and(
        !search_str
          ? undefined
          : or(
            like(retailOrders.tenChuxe, `%${search_str}%`),
            like(retailOrders.email, `%${search_str}%`),
            like(retailOrders.bienSo, `%${search_str}%`),
            like(retailOrders.id, `%${search_str}%`),
          )
        , (!provider || provider === 'all') ? undefined : like(retailOrders.ncc, provider),
        (!status || status === 'all') ? undefined : eq(retailOrders.status, status),
        (!loaiSanPham || loaiSanPham === 'all') ? undefined : eq(retailOrders.loaiSanPham, loaiSanPham),
        !startDateStr.length ? undefined : gt(retailOrders.createdAt, TZDate.tz(tzone, parse(`${startDateStr} 00:00:00`, 'yyyy-MM-dd HH:mm:ss', new Date()))),
        !endDateStr.length ? undefined : lt(retailOrders.createdAt, TZDate.tz(tzone, parse(`${endDateStr} 23:59:59`, 'yyyy-MM-dd HH:mm:ss', new Date()))),
      ),
      )
      .orderBy(desc(retailOrders.createdAt));

    // const json2csv = require('@types/json2csv');
    // const fieldNames = ['id', 'ten_chuxe', 'bien_so', 'so_khung', 'so_may', 'path_gtx', 'email', 'thanh_toan', 'ma_thanh_toan', 'ncc', 'loai_san_pham', 'status'];
    // const fields = ['id', 'tenChuxe', 'bienSo', 'soKhung', 'soMay', 'pathGtx', 'email', 'thanhToan', 'maThanhToan', 'ncc', 'loaiSanPham', 'status'];
    const opts = {};
    const parser = new AsyncParser(opts);
    // const parser = new Parser({
    //   fields,
    // });
    const csv = await parser.parse(orders).promise();
    // const data = json2csv({ data: orders, fields, fieldNames });
    // const csv = parser.parse(orders);

    const headers = new Headers();

    headers.set('Content-Type', 'text/csv');
    headers.set('Content-Disposition', `attachment;filename=export_${new Date()}.csv`);

    // return NextResponse.json(json_response);
    return new NextResponse(csv, { status: 200, statusText: 'OK', headers });
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

export async function getRetailOrderDetail(request: NextRequest) {
  try {
    const orderId = Number.parseInt(request.nextUrl.searchParams.get('id') || '');
    const orders = await db
      .select()
      .from(retailOrders)
      .where(eq(retailOrders.id, orderId));

    if (orders.length > 0) {
      const json_response = {
        status: 'success',
        orders,
      };
      return NextResponse.json(json_response);
    } else {
      return responseWithError('order is not found', ResponseCode.Err_204);
    }
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

export async function updateRetailOrderStatus(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);
    await db
      .update(retailOrders)
      .set({
        tenChuxe: data.tenChuxe,
        bienSo: data.bienSo,
        soKhung: data.soKhung,
        soMay: data.soMay,
        ncc: data.ncc,
        loaiSanPham: data.loaiSanPham,
        status: data.status,
      })
      .where(eq(retailOrders.id, data.id));

    const updateds = await db
      .select()
      .from(retailOrders)
      .where(eq(retailOrders.id, data.id));

    const updated = updateds[0];

    const json_response = {
      status: 'success',
      order: updated,
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};
