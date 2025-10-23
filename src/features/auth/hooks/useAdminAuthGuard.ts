import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/shared/auth/token";

const ADMIN_COOKIE = "admin_auth";

const hasAdminCookie = () => {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .some((cookie) => cookie.startsWith(`${ADMIN_COOKIE}=`));
};

export const useAdminAuthGuard = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    const hasCookie = hasAdminCookie();

    if (token && hasCookie) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    setAuthorized(false);
    setChecking(false);
    router.replace("/admin/login");
  }, [router]);

  return useMemo(
    () => ({
      authorized,
      checking,
    }),
    [authorized, checking],
  );
};
