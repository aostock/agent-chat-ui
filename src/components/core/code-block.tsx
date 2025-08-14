"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import xml from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";
// import "highlight.js/styles/github.css";
// import "highlight.js/styles/github-dark.css";

// Register languages
hljs.registerLanguage("json", json);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export function CodeBlock({
  children,
  language = "json",
  className,
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();

  const resetTheme = () => {
    // Dynamically import the highlight.js theme based on the current theme
    let themeLink = document.getElementById(
      "highlight-link",
    ) as HTMLLinkElement;
    if (!themeLink) {
      themeLink = document.createElement("link");
      themeLink.id = "highlight-link";
      themeLink.rel = "stylesheet";
      document.head.appendChild(themeLink);
    }
    if (!themeLink.href.includes(`highlight-${resolvedTheme}.css`)) {
      themeLink.href = `/static/styles/highlight-${resolvedTheme}.css`;
    }

    console.log("change theme", resolvedTheme, new Date());
  };

  useEffect(resetTheme, [resolvedTheme]); // Re-run effect when theme changes

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children, language]);

  resetTheme();

  return <code ref={codeRef}>{children}</code>;
}
