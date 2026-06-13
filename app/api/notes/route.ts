import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../_utils/utils';

// Прямий URL до бекенду GoIT для серверних запитів
const GOIT_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://goit.study';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Дістаємо токен із куки
    const token = cookieStore.get('accessToken')?.value || '';

    const search = request.nextUrl.searchParams.get('search') ?? '';
    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const rawTag = request.nextUrl.searchParams.get('tag') ?? '';
    const tag = rawTag === 'All' ? '' : rawTag;

    // 🚀 ВИПРАВЛЕНО: Запит йде НАПРЯМУ на GoIT домен, обходячи локальний baseURL
    const res = await axios.get(`${GOIT_BACKEND_URL}/notes`, {
      params: {
        ...(search !== '' && { search }),
        page,
        perPage: 12,
        ...(tag && { tag }),
      },
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

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Дістаємо токен із куки
    const token = cookieStore.get('accessToken')?.value || '';
    const body = await request.json();

    // 🚀 ВИПРАВЛЕНО: Запит створення нотатки йде НАПРЯМУ на GoIT домен
    const res = await axios.post(`${GOIT_BACKEND_URL}/notes`, body, {
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
