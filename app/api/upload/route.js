import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "dua1tlkqa",
  api_key: "735939686477283",
  api_secret: "FFfYxrbVmJ6Dgc17Mmyhl84UvFg",
});

async function uploadToCloudinary(fileUri, fileName) {
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

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ message: "No file provided" }), {
        status: 400,
      });
    }

    const fileBuffer = await file.arrayBuffer();
    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    // Create a data URI for the file
    const fileUri = `data:${mimeType};${encoding},${base64Data}`;

    const res = await uploadToCloudinary(fileUri, file.name);

    if (res.success && res.result) {
      return new Response(
        JSON.stringify({ message: "success", imgUrl: res.result.secure_url }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "failure", error: res.error }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing upload:", error.message);
    return new Response(
      JSON.stringify({
        message: "Failed to upload file",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
