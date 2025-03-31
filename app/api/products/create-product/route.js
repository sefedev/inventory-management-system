import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price } = body;

    const product = await prisma.product.create({
      data: {
        name, price
      }
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