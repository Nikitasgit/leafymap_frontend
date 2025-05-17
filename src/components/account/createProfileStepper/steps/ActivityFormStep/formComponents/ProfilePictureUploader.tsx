import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { FormDataChangeHandler } from "../../../CreateProfileStepper.types";

type ProfilePictureUploaderProps = {
  onChange: FormDataChangeHandler;
  initialImage: string;
};

const ProfilePictureUploader = ({
  onChange,
  initialImage,
}: ProfilePictureUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange({
        target: {
          name: "profilePicture",
          value: file,
        },
      });
    }
  };

  return (
    <div>
      <label>
        {preview ? (
          <Image
            src={preview}
            alt="Aperçu photo de profil"
            width={200}
            height={200}
          />
        ) : (
          <span>Ajouter une photo</span>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default ProfilePictureUploader;
