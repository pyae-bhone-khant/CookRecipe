// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(request) {
//   const formData = await request.formData();
//   const file = formData.get('image');

//   if (!file) {
//     return NextResponse.json({ error: 'No cover image uploaded' }, { status: 400 });
//   }

//   try {
//     // Step 1: uploads/cover folder create if needed
//     const uploadDir = path.join(process.cwd(), 'public/uploads/cover');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // Step 2: unique file name generate
//     const timestamp = Date.now();
//     const ext = file.name.split('.').pop();
//     const newFilename = `cover-${timestamp}.${ext}`;
//     const filePath = path.join(uploadDir, newFilename);

//     // Step 3: save to disk
//     const buffer = await file.arrayBuffer();
//     await fs.promises.writeFile(filePath, Buffer.from(buffer));

//     return NextResponse.json({
//       image_url: `/uploads/cover/${newFilename}`,
//     });

//   } catch (error) {
//     console.error('Cover image upload error:', error);
//     return NextResponse.json({ error: 'Failed to upload cover image' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { image, imageType } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'No cover image data provided' },
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
      uploadType: 'cover',
      message: 'Cover image processed successfully'
    });

  } catch (error) {
    console.error('Cover image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process cover image' },
      { status: 500 }
    );
  }
}
