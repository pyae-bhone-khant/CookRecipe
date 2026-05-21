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
//     return NextResponse.json({ error: 'No profile image uploaded' }, { status: 400 });
//   }

//   try {
//     const uploadDir = path.join(process.cwd(), 'public/uploads/profile');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const timestamp = Date.now();
//     const ext = file.name.split('.').pop();
//     const newFilename = `profile-${timestamp}.${ext}`;
//     const filePath = path.join(uploadDir, newFilename);

//     const buffer = await file.arrayBuffer();
//     await fs.promises.writeFile(filePath, Buffer.from(buffer));

//     return NextResponse.json({
//       image_url: `/uploads/profile/${newFilename}`,
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: 'Failed to upload profile image' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { image, imageType } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'No profile image data provided' },
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
      uploadType: 'profile',
      message: 'Profile image processed successfully'
    });

  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process profile image' },
      { status: 500 }
    );
  }
}
