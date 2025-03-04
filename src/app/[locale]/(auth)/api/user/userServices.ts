import AppConstants, { ResponseCode } from '@/constants/appConstants';
import { db } from '@/libs/DB';
import { discountGroup, userRoles, users } from '@/models/Schema';
import { clerkClient } from '@clerk/nextjs/server';
import { count, eq, inArray, like, or } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { responseWithError } from '../serviceHelpers';

export async function getUsers(request: NextRequest) {
  try {
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
    const search = request.nextUrl.searchParams.get('search') || '';

    const usersList = await db
      .select()
      .from(users)
      .where(
        search ? or(like(users.userName, `%${search}%`), like(users.userEmail, `%${search}%`)) : undefined,
      )
      .limit(limit)
      .offset((page - 1) * limit);

    const total = await db
      .select({ count: count() })
      .from(users)
      .where(
        search ? or(like(users.userName, `%${search}%`), like(users.userEmail, `%${search}%`)) : undefined,
      );

    return NextResponse.json({
      status: 'success',
      users: usersList,
      count: total[0]?.count || 0,
    });
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
}

export async function getUserDetail(request: NextRequest) {
  try {
    const userId = Number(request.nextUrl.searchParams.get('id'));
    if (!userId) {
      return responseWithError('Invalid user ID', ResponseCode.Err_400);
    }

    const user = await db
      .select({
        id: users.userId,
        name: users.userName,
        email: users.userEmail,
        role: userRoles.userRoleId,
        status: users.statusId,
        discountName: discountGroup.farmName,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.userId, userRoles.userId))
      .leftJoin(discountGroup, eq(users.departmentId, discountGroup.farmId))
      .where(eq(users.userId, userId));

    if (!user.length) {
      return responseWithError('User not found', ResponseCode.Err_204);
    }

    return NextResponse.json({ status: 'success', user: user[0] });
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
}

export async function syncUsers() {
  try {
    const clerkUsers = await clerkClient.users.getUserList();
    const userIds = clerkUsers.data.map(u => u.id);

    const existingUsers = await db
      .select({ externalId: users.userId })
      .from(users)
      .where(inArray(users.userId, userIds));

    const existingIds = new Set(existingUsers.map(u => u.externalId));
    const newUsers = clerkUsers.data.filter(u => !existingIds.has(u.id));

    if (newUsers.length) {
      await db.insert(users).values(
        newUsers.map(user => ({
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.emailAddresses[0]?.emailAddress || '',
          phoneNumber: user.phoneNumbers[0]?.phoneNumber || '',
          statusId: AppConstants.UserStatus.INACTIVE,
          note: '',
        })),
      );
    }

    return newUsers.length;
  } catch (error: any) {
    console.error(error);
    return 0;
  }
}

export async function editActiveUser(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) {
      return responseWithError('User ID is required', ResponseCode.Err_400);
    }

    await db
      .update(users)
      .set({
        statusId: data.status,
        note: data.note,
        userName: data.name,
        userEmail: data.email,
        phoneNumber: data.phoneNumber,
        departmentId: data.departmentId,
      })
      .where(eq(users.userId, data.id));

    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, data.id));

    if (!updatedUser.length) {
      return responseWithError('User not found after update', ResponseCode.Err_404);
    }

    return NextResponse.json({ status: 'success', user: updatedUser[0] });
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
}
