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



import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'recipes');

function getFileExtension(fileName) {
  const extension = path.extname(fileName).toLowerCase();
  return extension || '.jpg';
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getFileExtension(file.name);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
    const outputPath = path.join(UPLOAD_DIR, filename);

    const optimizedBuffer = await sharp(buffer)
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80, progressive: true })
      .toBuffer();

    const blurBuffer = await sharp(buffer)
      .rotate()
      .resize(16, 16, { fit: 'cover' })
      .jpeg({ quality: 35 })
      .toBuffer();

    await writeFile(outputPath, optimizedBuffer);

    return NextResponse.json({
      success: true,
      image_url: `/uploads/recipes/${filename}`,
      blurDataURL: `data:image/jpeg;base64,${blurBuffer.toString('base64')}`,
      message: 'Image processed successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
