import { NextResponse } from "next/server";
import * as yup from "yup";
import { prisma } from "@/lib/prisma"; //pisma ချိတ်
import bcrypt from "bcryptjs";

const schema = yup.object().shape({
    username: yup.string().required("Name is required"),
    email: yup.string().email("Must be a valid email").required("Email is required"),
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, 'Password must contain at least one number'),
});



// get user list api


export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json({ users }); // 
}



//create
export async function POST(req) {
    try {
        const body = await req.json();
        const { username, email, password } = await schema.validate(body, { abortEarly: false });

        // 1. Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email },
                { username },
              ]
            }
        });

        if (existingUser) {
            const message = existingUser.email === email
                ? "A user with this email already exists."
                : "This username is already taken.";
            return NextResponse.json(
                { message },
                { status: 409 } // 409 Conflict
            );
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const users = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        const { password: _, ...userWithoutPassword } = users;

        return NextResponse.json({
            message: "User is successfully created.",
            user: userWithoutPassword,
        }, { status: 201 });
    } catch (error) {
        // return NextResponse.json({ message: "Internal Server Error" }, { status: 500 }); //we need to mark that error message have the (status) attrubute
        if (error.name === "ValidationError") {
            return NextResponse.json(
                {
                    message: "Validation Failed",
                    errors: error.inner.map((e) => ({       //we used map for the output that we want
                        path: e.path,
                        message: e.message,
                    })),
                }, { status: 400 }
            );
        }
        return NextResponse.json({
            message: "Unexpected error",
            error: error.message,
        }, {
            status: 500
        });
    }
}


