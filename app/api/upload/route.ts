import cloudinary from "cloudinary";
import { NextRequest } from "next/server";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define types for Cloudinary upload result
type CloudinaryUploadResult = {
  secure_url: string;
};

type CloudinaryResponse = {
  success: boolean;
  result?: CloudinaryUploadResult;
  error?: unknown;
};

// Helper function to upload to Cloudinary
async function uploadToCloudinary(
  fileUri: string,
  fileName: string
): Promise<CloudinaryResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      fileUri,
      { resource_type: "image", public_id: fileName },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject({ success: false, error });
        } else {
          resolve({ success: true, result });
        }
      }
    );
  });
}

// Type-safe POST handler
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ message: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    // Create a data URI for the file
    const fileUri = `data:${mimeType};${encoding},${base64Data}`;

    // Upload to Cloudinary
    const res = await uploadToCloudinary(fileUri, file.name);

    if (res.success && res.result) {
      return new Response(
        JSON.stringify({ message: "success", imgUrl: res.result.secure_url }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "failure", error: res.error }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error processing upload:", error.message);
      return new Response(
        JSON.stringify({
          message: "Failed to upload file",
          error: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
