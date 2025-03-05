import type { NextRequest } from 'next/server';
import { createUser, deleteUser, getUsers, updateUser } from './userServices';

export const GET = async (request: NextRequest) => {
  return getUsers(request);
};

export const POST = async (request: NextRequest) => {
  return createUser(request);
};

export const PUT = async (request: NextRequest) => {
  return updateUser(request);
};

export const DELETE = async (request: NextRequest) => {
  return deleteUser(request);
};
