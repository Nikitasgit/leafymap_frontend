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
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      // Validation du type de fichier
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Type de fichier invalide. Seuls JPEG, PNG, GIF et WebP sont autorisés."
        );
        return;
      }

      // Validation de la taille (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("La taille du fichier doit être inférieure à 5MB.");
        return;
      }

      setPreview(URL.createObjectURL(file));
      onChange({
        target: {
          name: "image",
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
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "block", marginTop: "10px" }}
        />
      </label>
      {error && (
        <div style={{ color: "red", marginTop: "5px", fontSize: "14px" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;
