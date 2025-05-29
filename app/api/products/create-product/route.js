import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {userId, name, price } = body;

    // Validate input
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid input. 'name' must be a non-empty string." },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Invalid input. 'price' must be a number greater than 0." },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: {id: userId}
    })

    if(!userExists) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const product = await prisma.product.create({
      data: {
        userId,
        name,
        price,
      },
    });

    console.log("Product created successfully", product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product cannot be created", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
