import type { NextRequest } from 'next/server';
import { db } from '@/libs/DB';
import { users } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = Number.parseInt(params.userId);

  // Kiểm tra nếu ID người dùng không hợp lệ
  if (isNaN(userId)) {
    return NextResponse.json({ status: 'error', message: 'Invalid user ID' }, { status: 400 });
  }

  try {
    // Xóa người dùng
    const deletedUser = await db.delete(users).where(eq(users.userId, userId)).returning();

    // Kiểm tra nếu không có người dùng nào bị xóa
    if (!deletedUser.length) {
      return NextResponse.json({ status: 'error', message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'success', message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
