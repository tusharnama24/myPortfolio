import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {
      authorized: false,
      response: Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      ),
    };
  }

  if (session.user.role !== "admin") {
    return {
      authorized: false,
      response: Response.json(
        {
          success: false,
          message: "Forbidden",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}