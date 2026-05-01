import { connection } from 'next/server';
import { dbConnect } from '@/lib/db';
import Translation, { TranslationDoc } from '@/models/Translation';
import { NextRequest } from 'next/server';
import { API_ERROR_MESSAGES, HTTP_STATUS } from '@/api/config';

export async function GET(req: NextRequest) {
  await connection();
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get('lang');
  if (!lang) {
    return Response.json(
      { error: API_ERROR_MESSAGES.MISSING_PARAMS },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }
  // 用 model 查询并类型断言
  const doc = (await Translation.findOne({})) as TranslationDoc | null;
  if (!doc || !doc[lang]) {
    return Response.json(
      { error: API_ERROR_MESSAGES.DATA_NOT_FOUND },
      { status: HTTP_STATUS.NOT_FOUND }
    );
  }
  return Response.json(doc[lang]);
}
