import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, image, emailVerified } = body;

    // Check if the user already exists in the database
    console.log(email, "EMAIL")
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      console.log("User already exists, logging in", user);
    } else {
      // Create a new user in the database
      user = await prisma.user.create({
        data: {
          name,
          email,
          image,
          emailVerified: emailVerified ? new Date(emailVerified) : null,
        },
      });
      console.log("User created successfully", user);
    }

    // Return the user (existing or newly created) as the logged-in user
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error handling user creation/login", error);
    return NextResponse.json(
      { error: "Failed to handle user creation/login" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}