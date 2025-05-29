import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  
  try {
    const body = await request.json();
    const { userId, items } = body;

    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input. Ensure items is a non-empty array.' },
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

    // Validate each sale item
    for (const item of items) {
      if (
        !item.productId ||
        typeof item.quantity !== 'number' ||
        item.quantity <= 0 ||
        typeof item.unitPrice !== 'number' ||
        item.unitPrice <= 0
      ) {
        return NextResponse.json(
          { error: 'Each sale item must have a valid productId, quantity > 0, and unitPrice > 0.' },
          { status: 400 }
        );
      }
    }

    // Validate productIds
    const productIds = items.map((item) => item.productId);
    const existingProducts = await prisma.product.findMany({
      where: { productId: { in: productIds } },
      select: { productId: true },
    });

    const existingProductIds = existingProducts.map((p) => p.productId);
    const invalidProductIds = productIds.filter((id) => !existingProductIds.includes(id));

    if (invalidProductIds.length > 0) {
      return NextResponse.json(
        { error: `Invalid productId(s): ${invalidProductIds.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate Stock availability
    const products = await prisma.product.findMany({
      where: { productId: { in: productIds } },
      select: { productId: true, stockAvailable: true },
    });

    const insufficientStock = items.filter((item) => {
      const product = products.find((p) => p.productId === item.productId);
      return !product || product.stockAvailable < item.quantity;
    });

    if (insufficientStock.length > 0) {
      return NextResponse.json(
        {
          error: `Insufficient stock for product(s): ${insufficientStock
            .map((item) => item.productId)
            .join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Calculate total amount and item totals
    const saleItems = items.map((item) => ({
      ...item,
      itemTotal: item.quantity * item.unitPrice,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    // Create the sale using a transaction
    const saleOrder = await prisma.$transaction(async (prisma) => {
      return prisma.sale.create({
        data: {
          userId,
          totalAmount,
          saleItems: {
            create: saleItems.map((item) => ({
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              itemTotal: item.itemTotal,
              product: {
                connect: { productId: item.productId },
              },
            })),
          },
        },
        include: {
          saleItems: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });
    });

     //Update stock for each product
     const updateStockPromises = items.map((item) => {
      return prisma.product.update({
        where: { productId: item.productId },
        data: {
          stockAvailable: {
            decrement: item.quantity, // Subtract Sold quantity from stock
          },
        },
      });
    })
    

    try {
      const results = await Promise.all(updateStockPromises);
      console.log("Stock updated successfully:", results);
    } catch (error) {
      console.error("Error updating stock:", error.message);
    }

    return NextResponse.json(saleOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating sale order:', error.message);
    return NextResponse.json(
      { error: 'Failed to create sale order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}