import { ResponseCode } from '@/constants/appConstants';
import { db } from '@/libs/DB';
import { companyInfo, userRoles, users } from '@/models/Schema';
import { count, eq, like, or } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';
import { responseWithError } from '../serviceHelpers';

// Get all users with pagination and search
export async function getUsers(request: NextRequest) {
  try {
    const page = Number(request.nextUrl.searchParams.get('page')) || 1;
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 10;
    const search = request.nextUrl.searchParams.get('search') || '';

    if (page <= 0 || limit <= 0) {
      return responseWithError('Invalid pagination parameters', ResponseCode.Err_400);
    }

    const usersList = await db
      .select()
      .from(users)
      .where(
        search ? or(like(users.userName, `%${search}%`), like(users.userEmail, `%${search}%`)) : undefined,
      )
      .limit(limit)
      .offset((page - 1) * limit);

    const totalQuery = await db
      .select({ count: count() })
      .from(users)
      .where(
        search ? or(like(users.userName, `%${search}%`), like(users.userEmail, `%${search}%`)) : undefined,
      );

    const total = totalQuery.length ? totalQuery[0].count : 0;

    return NextResponse.json({
      status: 'success',
      users: usersList,
      count: total,
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
      .leftJoin(companyInfo, eq(users.departmentId, companyInfo.farmId))
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

    // Danh sách các field hợp lệ
    const validFields = ['userName', 'userEmail', 'departmentId', 'note', 'statusId'];

    // Kiểm tra nếu có field nào không hợp lệ
    const invalidFields = Object.keys(data).filter(key => !validFields.includes(key));
    if (invalidFields.length > 0) {
      return responseWithError(`Invalid fields: ${invalidFields.join(', ')}`, ResponseCode.Err_400);
    }

    const validData = {
      userName: data.userName,
      userEmail: data.userEmail,
      departmentId: data.departmentId,
      note: data.note,
      statusId: data.statusId ?? 1,
    };

    const newUser = await db.insert(users).values(validData).returning();
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

    const existingUser = await db.select().from(users).where(eq(users.userId, data.id));
    if (!existingUser.length) {
      return responseWithError('User not found', ResponseCode.Err_204);
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
    const data = await request.json();
    const userId = Number(data.id);

    if (!userId) {
      return responseWithError('User ID is required', ResponseCode.Err_400);
    }

    const existingUser = await db.select().from(users).where(eq(users.userId, userId));
    if (!existingUser.length) {
      return responseWithError('User not found', ResponseCode.Err_204);
    }

    await db.delete(users).where(eq(users.userId, userId));
    return NextResponse.json({ status: 'success', message: 'User deleted successfully' });
  } catch (error: any) {
    return responseWithError(error.message, ResponseCode.Err_500);
  }
}
