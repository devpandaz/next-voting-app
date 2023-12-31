// https://imkarthikeyans.hashnode.dev/how-to-add-comments-using-utterances-to-your-nextjs-blog
import { useEffect, useState } from "react";

// we need a function that accepts the script src and couple of other parameters

function useScript(params) {
  const { url, theme, issueTerm, repo, label, ref } = params;

  const [status, setStatus] = useState(url ? "loading" : "idle");

  // run the useEffect when the url of the script changes
  useEffect(() => {
    if (!url) {
      setStatus("idle");
      return;
    }

    let script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("theme", theme);
    script.setAttribute("issue-term", issueTerm);
    script.setAttribute("repo", repo);
    script.setAttribute("label", label);

    // Add script to document body
    ref.current.appendChild(script);

    // store status of the script
    function setAttributeStatus(event) {
      /**
                 * Console.log value from event
                    {
                        bubbles: false
                        cancelBubble: false
                        cancelable: false
                        composed: false
                        currentTarget: null
                        defaultPrevented: false
                        eventPhase: 0
                        isTrusted: true
                        path: [script]
                        returnValue: true
                        srcElement: null
                        target: null
                        timeStamp: 276483.5
                        type: "load"
                    }

                    based on the type property we will get know whether script is ready or errored out
                    */
      setStatus(event.type === "load" ? "ready" : "error");
    }

    script.addEventListener("load", setAttributeStatus);
    script.addEventListener("error", setAttributeStatus);

    return () => {
      // useEffect clean up
      if (script) {
        script.removeEventListener("load", setAttributeStatus);
        script.removeEventListener("error", setAttributeStatus);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, theme]);
  return status;
}

export default useScript;
