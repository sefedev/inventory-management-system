import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { purchaseItems } = body;

    // Validate input
    if (!Array.isArray(purchaseItems) || purchaseItems.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input. Ensure purchaseItems is a non-empty array.' },
        { status: 400 }
      );
    }

    // Validate each purchase item
    for (const item of purchaseItems) {
      if (
        !item.productId ||
        typeof item.quantity !== 'number' ||
        item.quantity <= 0 ||
        typeof item.unitPrice !== 'number' ||
        item.unitPrice <= 0
      ) {
        return NextResponse.json(
          { error: 'Each purchase item must have a valid productId, quantity > 0, and unitPrice > 0.' },
          { status: 400 }
        );
      }
    }

    // Validate productIds
    const productIds = purchaseItems.map((item) => item.productId);
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

    // Calculate total cost of the purchase order
    const totalAmount = purchaseItems.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    // Create the purchase order using a transaction
    const purchaseOrder = await prisma.$transaction(async (prisma) => {
      return prisma.purchase.create({
        data: {
          totalAmount,
          purchaseItems: {
            create: purchaseItems.map((item) => ({
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              itemTotal: item.quantity * item.unitPrice,
              product: {
                connect: { productId: item.productId },
              },
            })),
          },
        },
        include: {
          purchaseItems: {
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

    return NextResponse.json(purchaseOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase order:', error.message);
    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}