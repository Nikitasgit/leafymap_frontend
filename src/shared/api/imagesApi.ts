import { request } from "@/shared/api/client";
import type { Image } from "@/shared/types/image";

export type ImageReferenceType =
  | "Place"
  | "User"
  | "Event"
  | "Message"
  | "Review";

export type ImageType = "profile" | "cover" | "gallery" | "other";

export const fetchImages = async (
  reference: string,
  referenceType: ImageReferenceType,
  type?: ImageType,
): Promise<Image[]> => {
  const data = await request<{ images?: Image[] }>({
    method: "GET",
    url: `/api/images/`,
    params: {
      reference,
      referenceType,
      ...(type ? { type } : {}),
    },
  });
  return Array.isArray(data?.images) ? data.images : [];
};

export const deleteImages = async (images: string[]): Promise<void> => {
  await request<void>({
    method: "DELETE",
    url: `/api/images`,
    data: { images },
  });
};

export interface SubmitImagesParams {
  files: File[];
  reference: string;
  referenceType: string;
  type: string;
}

export interface UploadImagesResponse {
  images: Array<{
    id: string;
    urls: {
      original: string;
      thumbnail: string;
      medium: string;
    };
    signedUrls: {
      original: string;
      thumbnail: string;
      medium: string;
    };
    referenceType: string;
    reference: string;
    type: string;
    originalName: string;
    size: number;
    mimetype: string;
    createdAt: string;
    updatedAt: string;
  }>;
  count: number;
}

export const submitImages = async (
  params: SubmitImagesParams,
): Promise<UploadImagesResponse> => {
  const formData = new FormData();
  params.files.forEach((file) => {
    formData.append("images", file);
  });
  formData.append("reference", params.reference);
  formData.append("referenceType", params.referenceType);
  formData.append("type", params.type);

  return request<UploadImagesResponse>({
    method: "POST",
    url: "/api/images",
    data: formData,
  });
};
