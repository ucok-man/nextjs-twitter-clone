/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { BiX } from "react-icons/bi";

type Props = {
  onChange: (base64?: string) => void;
  label: string;
  value?: string;
  disabled?: boolean;
};

export default function InputImage(props: Props) {
  const [imageSrc, setImageSrc] = useState(props.value);

  const { mutate: toogleUpload, isPending } = useMutation({
    mutationFn: async (
      param:
        | { action: "upload"; image: string }
        | { action: "delete"; imagePath: string }
    ) => {
      switch (param.action) {
        case "upload": {
          const { data } = await axios.post("/api/images", {
            image: param.image,
          });
          return data as { message: string; url: string };
        }

        case "delete": {
          const { data } = await axios.delete("/api/images", {
            data: {
              imagePath: param.imagePath,
            },
          });
          return data as { message: string };
        }
      }
    },
    onError: () => {
      toast.error("Error processing image");
    },
  });

  const handleDrop = (files: any) => {
    const file = files[0];
    const reader = new FileReader();

    // setup event handler when done reading file
    reader.onload = (event: any) => {
      toogleUpload(
        {
          action: "upload",
          image: event.target.result,
        },
        {
          onSuccess: (data: any) => {
            setImageSrc(data.url);
            props.onChange(data.url);
          },
        }
      );
    };

    // read the file as base64
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    disabled: props.disabled || isPending,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  return (
    <div
      {...getRootProps({
        className:
          "w-full p-4 text-white text-center border-2 border-dotted rounded-md border-neutral-700 cursor-pointer",
      })}
    >
      <input {...getInputProps()} />
      {imageSrc ? (
        <div className="flex items-center justify-center aspect-video relative w-full group">
          <Image src={imageSrc} fill alt="Uploaded image" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // <--- Cegah klik tombol menyebar ke parent
              toogleUpload(
                {
                  action: "delete",
                  imagePath: imageSrc,
                },
                {
                  onSuccess: () => {
                    setImageSrc(undefined);
                    props.onChange(undefined);
                  },
                }
              );
            }}
            className="absolute inset-0 flex justify-center items-center group-hover:backdrop-brightness-50 transition-all duration-150 z-40"
          >
            <BiX className="opacity-0 size-16 scale-95 group-hover:opacity-100 hover:scale-100 transition-all duration-150" />
          </button>
        </div>
      ) : (
        <p className="text-white">{props.label}</p>
      )}
    </div>
  );
}
