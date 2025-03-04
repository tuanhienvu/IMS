import { and, eq } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

import { ResponseCode } from '@/constants/appConstants';
import { dbAgency as db } from '@/libs/DB';
import { discount, discountGroup, insuranceType, providers, vehicleType } from '@/models/Schema';

import { responseWithError } from '../serviceHelpers';

export async function getAllVehicles() {
  try {
    const vehicleTypes = await db
      .select()
      .from(vehicleType);

    const insuranceTypes = await db
      .select()
      .from(insuranceType);

    const json_response = {
      status: 'success',
      carTypes: vehicleTypes,
      insuranceTypes,
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

export async function getAllProviders() {
  try {
    const provs = await db
      .select()
      .from(providers);

    const json_response = {
      status: 'success',
      providers: provs,
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

export async function getDiscountPresets() {
  try {
    const discounts = await db
      .select()
      .from(discountGroup);

    const json_response = {
      status: 'success',
      discounts,
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

async function getDiscountList(discountGroupId: number) {
  if (!discountGroupId) {
    return [];
  }
  const discountsItems = await db
    .select({
      id: discount.id,
      discountGroupId: discount.discountGroupId,
      providerId: discount.providerId,
      percentage: discount.percentage,
      providerName: providers.name,
      vehicleTypeId: vehicleType.id,
      vehicleName: vehicleType.name,
      insuranceTypeId: insuranceType.id,
      insuranceName: insuranceType.name,
    })
    .from(discount)
    .leftJoin(vehicleType, eq(vehicleType.id, discount.vehicleTypeId))
    .leftJoin(providers, eq(providers.id, discount.providerId))
    .leftJoin(insuranceType, eq(insuranceType.id, discount.insuranceTypeId))
    .where(eq(discount.discountGroupId, discountGroupId));
  console.log(discountsItems);
  return discountsItems;
}

export async function getDiscountsGroupDetail(discountGroupId: number) {
  try {
    const discountGroupDetails = await db
      .select()
      .from(discountGroup)
      .where(eq(discountGroup.id, discountGroupId));

    let resData = null;
    if (discountGroupDetails.length) {
      resData = discountGroupDetails[0];
    }

    const discounts = await getDiscountList(discountGroupId);

    const json_response = {
      status: 'success',
      data: {
        discountGroup: resData,
        discounts,
      },
    };

    console.log(json_response);
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

export async function getDiscountsItemInGroup(discountGroupId: number) {
  try {
    const discounts = await getDiscountList(discountGroupId);

    const json_response = {
      status: 'success',
      discounts,
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

export async function createDiscountGroup(request: NextRequest) {
  try {
    const data = await request.json();
    const dataGroup = {
      name: data.name || '',
      description: data.description || '',
    };
    // check duplicated
    const existed = await db
      .select()
      .from(discountGroup)
      .where(eq(discountGroup.name, dataGroup.name));
    if (existed) {
    // duplicated name, add suffix and auto inscrease the suffix
      const sSplitted = dataGroup.name.split('_');
      if (sSplitted.length > 1) {
        const oldNum = sSplitted[sSplitted.length];
        const oldVal = Number(oldNum);
        if (!Number.isNaN(oldVal)) {
          dataGroup.name = dataGroup.name.replace(new RegExp(`${oldNum}$`), oldVal + 1);
        } else {
          dataGroup.name = `${dataGroup.name}_1`;
        }
      } else {
        dataGroup.name = `${dataGroup.name}_1`;
      }
    }

    const insertDiscountGroup = await db.insert(discountGroup)
      .values(dataGroup).returning();

    const json_response = {
      status: 'success',
      data: insertDiscountGroup[0],
      discounts: [],
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

export async function createDiscountItemInGroup(request: NextRequest) {
  try {
    const data = await request.json();
    const dataItem = {
      providerId: data.providerId,
      vehicleTypeId: data.vehicleTypeId,
      discountGroupId: data.discountGroupId,
      insuranceTypeId: data.insuranceTypeId,
      percentage: data.percentage,
      name: '',
    };
    if (!dataItem.providerId || !dataItem.vehicleTypeId || !dataItem.discountGroupId) {
      return responseWithError('Please select provide/vehicle type/discount group', ResponseCode.Err_500);
    }

    // check type and provider
    // name = type + provider
    const provider = await db
      .select()
      .from(providers)
      .where(eq(providers.id, dataItem.providerId));
    const vehicle = await db
      .select()
      .from(vehicleType)
      .where(eq(vehicleType.id, dataItem.vehicleTypeId));

    const insurance = await db
      .select()
      .from(insuranceType)
      .where(eq(insuranceType.id, dataItem.insuranceTypeId));

    if (provider && vehicle && insurance) {
      // duplicated name, add suffix and auto inscrease the suffix
      dataItem.name = (provider[0]?.name || '') + (vehicle[0]?.name || '') + (insurance[0]?.name || '');
    }

    let existed = await db
      .select()
      .from(discount)
      .where(
        and(
          eq(discount.discountGroupId, dataItem.discountGroupId),
          eq(discount.providerId, dataItem.providerId),
          eq(discount.vehicleTypeId, dataItem.vehicleTypeId),
          eq(discount.insuranceTypeId, dataItem.insuranceTypeId),
        ),
      );

    if (!existed.length) {
      existed = await db.insert(discount)
        .values(dataItem).returning();
    } else {
      return responseWithError('Item already existed', ResponseCode.Err_500);
    }

    const discountsItems = await getDiscountList(data.discountGroupId);

    const json_response = {
      status: 'success',
      discounts: discountsItems,
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};

export async function removeDiscountItemInGroup(request: NextRequest) {
  try {
    const data = await request.json();
    const dataItem = {
      id: data.id,
    };
    if (!dataItem.id) {
      return responseWithError('Please select item to be deleted', ResponseCode.Err_500);
    }

    // check type and provider
    // name = type + provider
    await db
      .delete(discount)
      .where(
        eq(discount.id, dataItem.id),
      );

    const discounts = await getDiscountList(data.discountGroupId);
    const json_response = {
      status: 'success',
      discounts,
    };
    return NextResponse.json(json_response);
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
};
