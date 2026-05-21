import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Single notification
export async function GET(req, { params }) {
  try {
    const notificationId = parseInt(params.id);
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// Update Recipe API
export async function PUT(req, context) {
  try {
    const { params } = context;
    const recipeId = parseInt(params.id); 
    const { status } = await req.json(); 

    const validStatuses = ['pending', 'approve', 'reject'];

    // Status validation
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Allowed values are: ${validStatuses.join(', ')}`,
          received: status,
        },
        { status: 400 } // Bad Request
      );
    }

    // Prisma ဖြင့် recipe status ကို update လုပ်ခြင်း
    // notification ပို့ဖို့အတွက် user_id နဲ့ recipe name လိုအပ်တာကြောင့် user နဲ့ category ကို include လုပ်ထားပါတယ်။
    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: { status },
      include: {
        user: true, // User information ကိုပါ ထည့်သွင်းယူလာပါ။ (user_id နဲ့ username အတွက်)
        category: true, // Category information ကိုပါ ထည့်သွင်းယူလာပါ။ (category name အတွက်)
      }
    });

    
    return NextResponse.json({
        message: "Recipe status updated successfully.",
        data: updatedRecipe 
    }, { status: 200 }); 

  } catch (error) {
    console.error("Error in PUT /api/admin/recipes/[id]:", error); 
   
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Recipe not found for update.' },
        { status: 404 } 
      );
    }

    
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          message: "Validation Failed",
          errors: error.inner.map((e) => ({
            path: e.path,
            message: e.message,
          })),
        }, { status: 400 }
      );
    }

    // အခြား မျှော်လင့်မထားသော Error များအတွက်
    return NextResponse.json({
        message: "Unexpected error during recipe update.",
        error: error.message || "An unknown error occurred.",
    }, {
        status: 500 // Internal Server Error
    });
  }
}



// DELETE: Remove notification
export async function DELETE(req, { params }) {
  try {
    const notificationId = parseInt(params.id);
    await prisma.notification.delete({ where: { id: notificationId } });

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

