import { NextRequest, NextResponse } from 'next/server';

// WordPress.com API 프록시 엔드포인트
// 로컬 HTML 파일에서 WordPress.com API를 직접 호출하면 CORS 에러가 발생하므로
// Vercel 서버를 경유하여 API를 호출합니다.

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET 요청: 사이트 정보 조회 (연결 테스트용)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteUrl = searchParams.get('site');
  const token = searchParams.get('token');

  if (!siteUrl || !token) {
    return NextResponse.json(
      { error: 'site와 token 파라미터가 필요합니다.' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const res = await fetch(
      `https://public-api.wordpress.com/rest/v1.1/sites/${siteUrl}`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status, headers: corsHeaders });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST 요청: 글 발행
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteUrl, token, postData } = body;

    if (!siteUrl || !token || !postData) {
      return NextResponse.json(
        { error: 'siteUrl, token, postData가 필요합니다.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const res = await fetch(
      `https://public-api.wordpress.com/rest/v1.1/sites/${siteUrl}/posts/new`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status, headers: corsHeaders });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
