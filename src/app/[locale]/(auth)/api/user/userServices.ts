import { ResponseCode } from '@/constants/appConstants';
import { db } from '@/libs/DB';
import { discountGroup, userRoles, users } from '@/models/Schema';
import { count, eq, like, or } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { responseWithError } from '../serviceHelpers';

// Get all users with pagination and search
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

// Get user details
export async function getUserDetail(request: NextRequest) {
  try {
    const userId = Number(request.nextUrl.searchParams.get('id'));
    if (!userId) {
      return responseWithError('Invalid user ID', ResponseCode.Err_400);
    }

    const user = await db
      .select()
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

// Create a new user
export async function createUser(request: NextRequest) {
  try {
    const data = await request.json();
    const newUser = await db.insert(users).values(data).returning();
    return NextResponse.json({ status: 'success', user: newUser[0] });
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
}

// Update an existing user
export async function updateUser(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.id) {
      return responseWithError('User ID is required', ResponseCode.Err_400);
    }

    await db.update(users).set(data).where(eq(users.userId, data.id));
    return NextResponse.json({ status: 'success', message: 'User updated successfully' });
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
}

// Delete a user
export async function deleteUser(request: NextRequest) {
  try {
    const userId = Number(request.nextUrl.searchParams.get('id'));
    if (!userId) {
      return responseWithError('Invalid user ID', ResponseCode.Err_400);
    }

    await db.delete(users).where(eq(users.userId, userId));
    return NextResponse.json({ status: 'success', message: 'User deleted successfully' });
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
}
