import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authorized: false,
      response: Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}