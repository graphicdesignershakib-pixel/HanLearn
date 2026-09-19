import { useEffect, useState } from "react";

export type RoutePath =
  | "/"
  | "/dashboard"
  | "/hsk"
  | "/vocabulary"
  | "/chat"
  | "/tutor"
  | "/speaking"
  | "/flashcards"
  | "/stories"
  | "/radicals"
  | "/etymology"
  | "/exam"
  | "/practice"
  | "/practice/pronunciation"
  | "/practice/tones"
  | "/practice/sentences"
  | "/writing"
  | "/saved"
  | "/progress"
  | "/settings"
  | "/dev/data-quality"
  | string;

export interface ParsedRoute {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

function getPathFromLocation(): string {
  if (typeof window === "undefined") return "/";
  // Check hash first for iframe resilience
  const hash = window.location.hash.replace(/^#/, "");
  if (hash) {
    return hash.startsWith("/") ? hash : `/${hash}`;
  }
  return window.location.pathname || "/";
}

export function parseRoute(fullPath: string): ParsedRoute {
  const [pathPart, queryPart] = fullPath.split("?");
  const query: Record<string, string> = {};
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((val, key) => {
      query[key] = val;
    });
  }

  const params: Record<string, string> = {};

  // Match /hsk/:level
  const hskMatch = pathPart.match(/^\/hsk\/([a-zA-Z0-9_-]+)$/);
  if (hskMatch) {
    params.level = hskMatch[1];
  }

  // Match /vocabulary/:id
  const vocabMatch = pathPart.match(/^\/vocabulary\/([a-zA-Z0-9_-]+)$/);
  if (vocabMatch) {
    params.id = vocabMatch[1];
  }

  // Match /writing/:character
  const writingMatch = pathPart.match(/^\/writing\/([^/?#]+)$/);
  if (writingMatch) {
    params.character = decodeURIComponent(writingMatch[1]);
  }

  return {
    path: pathPart,
    params,
    query,
  };
}

export function navigate(to: string) {
  if (typeof window === "undefined") return;
  const target = to.startsWith("/") ? to : `/${to}`;
  window.location.hash = target;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(getPathFromLocation());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(getPathFromLocation());
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const route = parseRoute(currentPath);

  return {
    currentPath,
    route,
    navigate,
  };
}
