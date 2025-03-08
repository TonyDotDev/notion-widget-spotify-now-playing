import { cookies } from "next/headers";

export async function GET() {
  const accessToken = (await cookies()).get("accessToken")?.value;

  return Response.json({ authenticated: !!accessToken });
}
