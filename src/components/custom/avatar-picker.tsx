import FieldLabel from "@/features/form/components/field-label";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface Props {
  onChange: (file: File) => void;
}

const AvatarPicker = ({ onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileSelected = e.target.files?.[0];

    if (fileSelected?.type.startsWith("image/")) {
      const url = URL.createObjectURL(fileSelected);
      setUrl(url);
      onChange(fileSelected);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-lg border p-2">
      <div className="flex flex-row gap-4 p-2">
        {url ? (
          <div className="relative aspect-square w-16 shrink-0 overflow-hidden rounded-md">
            <Image
              fill
              className="shrink-0 object-cover"
              src={url}
              alt="Workspace Temp Avatar"
            />
          </div>
        ) : (
          <div className="flex size-16 items-center justify-center rounded-md bg-gray-300">
            <ImageIcon className="size-7 text-gray-500" />
          </div>
        )}
      </div>
      <Button type="button" variant="blue" onClick={handleSelectClick}>
        Select
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AvatarPicker;
