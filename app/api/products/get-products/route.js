import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toString();
    const userId = searchParams.get("userId")?.toString();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        userId, 
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      orderBy: {
        name: "asc",
      },
    });

    
    // const products = await prisma.product.findMany({
    //   where: search
    //     ? {
    //         name: {
    //           contains: search,
    //           mode: "insensitive",
    //         },
    //       }
    //     : {},
    //     orderBy: {
    //       name: "asc"
    //     }
    // });


    console.log("Products fetched successfully", products);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products", error);
    return NextResponse.json(
      { message: "Error retrieving products" },
      { status: 500 }
    );
  }
}
