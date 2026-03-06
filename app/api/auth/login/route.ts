import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/schemas/auth";
import { getAccessToken, setRefreshToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = loginSchema.safeParse(body);
    if (!parseResult?.success) {
      return NextResponse.json(
        { error: parseResult.error.issues.map((e) => e.message) },
        { status: 400 },
      );
    }

    const { email, password } = parseResult.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "AUTH_INVALID_CREDENTIALS" },
        { status: 401 },
      );
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "AUTH_INVALID_CREDENTIALS" },
        { status: 401 },
      );
    }

    const accessToken = await getAccessToken(user);
    await setRefreshToken(user);

    return NextResponse.json({ accessToken });
  } catch (err) {
    return NextResponse.json(
      { error: "GENERARL_SERVER_ERROR" },
      { status: 500 },
    );
  }
}
