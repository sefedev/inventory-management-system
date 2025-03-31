import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { saleItems } = body;

    if(!Array.isArray(saleItems) || saleItems.length === 0) {
        return NextResponse.json(
            {error: "Invalid input"},
            {status: 400}
        )
    }

     // Fetch product details for all saleItems
    const productIds = saleItems.map((item) => item.productId)
   const products = await prisma.product.findMany({
        where: {productId: {in: productIds}}
    })

    //validate that all products exist
    if (products.length !== saleItems.length) {
        return NextResponse.json(
            {error: "One or more products not found"},
            {status: 404}
        )
    }

    let totalAmount = 0
    const saleItemsData = saleItems.map((item) => {
     const product = products.find(p => p.productId === item.productId)
     if(!product) {
        throw new Error(`Product with ID ${item.productId} not found`)
     }

     const unitPrice = product.price
     totalAmount += unitPrice * item.quantity

     return {
        quantity: item.quantity,
        unitPrice,
        product: {
            connect: {productId: item.productId}
        }
     }
    })

    const saleOrder = await prisma.sale.create({
      data: {
        totalAmount,
        saleItems: {
            create: saleItemsData
        }
      },
      include: {
        saleItems: {
            include: {
                product: true
            }
        }
      }
    });

    console.log("Sale Order created successfully", saleOrder);
    return NextResponse.json(saleOrder, { status: 201 });
  } catch (error) {
    console.error("Sale Order cannot be created", error);
    return NextResponse.json(
      { error: "Failed to create sale order" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}