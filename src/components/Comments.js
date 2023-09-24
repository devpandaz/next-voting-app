import React, { useRef } from "react";

import useScript from "../lib/use-script";
import { useTheme } from "next-themes";

const Comments = () => {
  const comment = useRef(null);
  const { theme } = useTheme();

  const status = useScript({
    url: "https://utteranc.es/client.js",
    theme: theme === "light" ? "github-light" : "github-dark",
    issueTerm: "url",
    repo: "devpandaz/next-voting-app",
    label: "comment",
    ref: comment,
  });

  return <div ref={comment}></div>;
};

export default Comments;
