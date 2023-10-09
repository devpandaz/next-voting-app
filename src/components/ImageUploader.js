import { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ImageUploader({ file, setFile }) {
  const uploaderArea = useRef();
  const previewImage = useRef();

  const { fileRejections, getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      const acceptedFile = acceptedFiles[0]; // only one file accepted

      try { // file may be rejected if not image/*, error handling is done using fileRejections below
        const objectURL = URL.createObjectURL(acceptedFile);
        setFile(
          Object.assign(acceptedFile, {
            preview: objectURL,
          }),
        );
      } catch (err) {
        console.log(err);
      }
    },
  });

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(file?.preview);
    };
  });

  useEffect(() => {
    function dragEnter() {
      uploaderArea.current.classList.add("brightness-75");
    }
    uploaderArea.current.addEventListener("dragenter", dragEnter);

    function dragLeave() {
      uploaderArea.current.classList.remove("brightness-75");
    }
    uploaderArea.current.addEventListener("dragleave", dragLeave);
    uploaderArea.current.addEventListener("drop", dragLeave);

    return () => {
      /* eslint-disable */
      // uploaderArea.current?.removeEventListener("dragenter", dragEnter);
      // uploaderArea.current?.removeEventListener("dragleave", dragLeave);
      // uploaderArea.current?.removeEventListener("drop", dragLeave);
    };

    /* eslint-enable */
  });

  useEffect(() => {
    function dragEnter() {
      previewImage.current?.classList.add("brightness-75");
    }
    previewImage.current?.addEventListener("dragenter", dragEnter);

    function dragLeave() {
      previewImage.current?.classList.remove("brightness-75");
    }
    previewImage.current?.addEventListener("dragleave", dragLeave);
    previewImage.current?.addEventListener("drop", dragLeave);

    return () => {
      /* eslint-disable */
      // previewImage.current?.removeEventListener("dragenter", dragEnter);
      // previewImage.current?.removeEventListener("dragleave", dragLeave);
      // previewImage.current?.removeEventListener("drop", dragLeave);

      /* eslint-enable */
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <>
      <div>
        <div
          {...getRootProps()}
          className={`bg-slate-200 dark:bg-slate-700 flex flex-col items-center justify-center rounded-md ${
            !file &&
            "p-1 border-2 border-slate-900 dark:border-slate-100 border-dashed hover:cursor-pointer"
          } mb-1 text-center whitespace-pre-line`}
          ref={uploaderArea}
        >
          <input {...getInputProps()} />
          {!file &&
            `Drag & drop an image
or click here`}
          {file &&
            (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="hover:cursor-pointer"
                ref={previewImage}
                src={file.preview}
                alt="poll image"
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
              />
            )}
        </div>
        {file &&
          (
            <div className="grid grid-flow-col justify-stretch">
              <Button
                onClick={open}
                className="text-black bg-yellow-300 hover:bg-yellow-300/90 dark:bg-red-300 dark:hover:bg-red-300/90 rounded-md"
              >
                Change
              </Button>
              <Button
                className="text-black bg-yellow-300 hover:bg-yellow-300/90 dark:bg-red-300 dark:hover:bg-red-300/90 rounded-md"
                onClick={() => {
                  setFile(null);
                }}
              >
                Remove
              </Button>
            </div>
          )}
      </div>
      <ul>
        {fileRejections[0]?.errors.map((e) => (
          <Alert key={e.code} variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              File must be an image.
            </AlertDescription>
          </Alert>
        ))}
      </ul>
    </>
  );
}
