import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, image, emailVerified } = body;

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        image,
        emailVerified: emailVerified ? new Date(emailVerified) : null,
      },
    });

    console.log("User created successfully", user);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("User cannot be created", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}