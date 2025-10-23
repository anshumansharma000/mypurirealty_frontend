import { api } from "@/shared/api/http";

const normalizePath = (p: string): string => {
  if (!p.startsWith("/")) return `/${p}`;
  return p;
};

export async function deleteListing(id: string, path?: string) {
  const normalizedPath =
    path && path.trim().length > 0
      ? normalizePath(path)
      : `/listings/${encodeURIComponent(id)}`;

  await api(normalizedPath, {
    method: "DELETE",
  });
}
