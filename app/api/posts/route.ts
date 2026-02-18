import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body.title, 'wwwwwwwwwwwwwweeeeeeeeee')
  console.log(body.content, '111111111111111111')

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return NextResponse.json(post);
}
