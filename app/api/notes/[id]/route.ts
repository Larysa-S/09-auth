import { NextResponse } from 'next/server'; // 🚀 ВИПРАВЛЕНО: Додано обов'язковий імпорт NextResponse
import axios from 'axios';
import { api } from '../../api';

interface RouteParams {
  params: Promise<{ id: string }> | { id: string };
}

// 🚀 1. GET /api/notes/:id — Отримання однієї нотатки за ID
export async function GET(request: Request, props: RouteParams) {
  try {
    const resolvedParams = 'then' in props.params ? await props.params : props.params;
    const { id } = resolvedParams;

    // Еталонний запит GoIT з прокиданням cookies з браузера
    const response = await api.get(`/notes/${id}`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      return NextResponse.json(
        { message: responseData?.message || 'Failed to fetch note' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// 🚀 2. DELETE /api/notes/:id — Видалення нотатки за ID
export async function DELETE(request: Request, props: RouteParams) {
  try {
    const resolvedParams = 'then' in props.params ? await props.params : props.params;
    const { id } = resolvedParams;

    // Еталонний запит GoIT з прокиданням cookies з браузера
    const response = await api.delete(`/notes/${id}`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string } | undefined;
      return NextResponse.json(
        { message: responseData?.message || 'Failed to delete note' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
