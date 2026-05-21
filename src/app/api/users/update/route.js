// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function PUT(req) {
//   try {
//     const body = await req.json();
//     const { userId, profileImage, coverImage } = body;

//     if (!userId) {
//       return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: userId },
//       data: {
//         ...(profileImage && { profileImage }),
//         ...(coverImage && { coverImage }),
//       },
//     });

//     return NextResponse.json({ message: 'User updated', user: updatedUser });
//   } catch (error) {
//     console.error('Update user failed:', error);
//     return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
//   }
// }


// /app/api/user/update/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust according to your prisma path

export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId, profileImage, coverImage } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(profileImage && { profileImage }),
        ...(coverImage && { coverImage }),
      },
    });

    return NextResponse.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
