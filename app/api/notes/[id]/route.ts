import { NextResponse } from 'next/server';
import axios from 'axios'; // 🚀 ВИПРАВЛЕНО
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';
import { isAxiosError } from 'axios';

const GOIT_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://goit.study';

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    const { id } = await params;

    // 🚀 ВИПРАВЛЕНО: Прямий запит на домен GoIT
    const res = await axios.get(`${GOIT_BACKEND_URL}/notes/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(error.response?.data || { message: error.message }, {
        status: error.response?.status || 400,
      });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    const { id } = await params;

    // 🚀
    const res = await axios.delete(`${GOIT_BACKEND_URL}/notes/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(error.response?.data || { message: error.message }, {
        status: error.response?.status || 400,
      });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || '';
    const { id } = await params;
    const body = await request.json();

    // 🚀
    const res = await axios.patch(`${GOIT_BACKEND_URL}/notes/${id}`, body, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(error.response?.data || { message: error.message }, {
        status: error.response?.status || 400,
      });
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
