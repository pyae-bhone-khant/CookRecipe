// // app/api/upload/route.js

// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const data = await req.formData(); // Assuming you're uploading FormData (e.g. file/image)
//   const file = data.get("file");

//   // Debug
//   console.log("File received:", file);

//   if (!file) {
//     return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//   }

//   // Here you could save to DB, cloud storage, etc.
//   return NextResponse.json({ message: "Upload successful", fileName: file.name });
// }


// app/api/upload/route.js

// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const data = await req.formData();

//   const file = data.get("image"); // ✅ Change from "file" ➜ "image" to match frontend

//   console.log("File received:", file);

//   if (!file) {
//     return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
//   }

//   // Dummy hosted URL (You can replace with actual upload logic)
//   const fakeImageUrl = `https://dummyimage.com/600x400/000/fff&text=${file.name}`;

//   return NextResponse.json({
//     message: "Upload successful",
//     fileName: file.name,
//     imageUrl: fakeImageUrl, // ✅ so frontend can use this
//   });
// }



import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { image, imageType, uploadType } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Validate base64 format
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format. Must be base64 encoded image.' },
        { status: 400 }
      );
    }

    // For base64 images, we return the base64 string directly
    // This will be stored in the database instead of as files
    return NextResponse.json({
      success: true,
      image_url: image, // Return the base64 string
      uploadType: uploadType || 'general',
      message: 'Image processed successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
