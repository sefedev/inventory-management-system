
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
      if (!item.productId || !item.quantity || !item.unitPrice) {
        return NextResponse.json(
          { error: 'Each purchase item must have productId, quantity, and unitPrice.' },
          { status: 400 }
        );
      }
    }

    // Calculate total cost of the purchase order
    const totalAmount = purchaseItems.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    // Create the purchase order
    const purchaseOrder = await prisma.purchase.create({
      data: {
        totalAmount,
        purchaseItems: {
          create: purchaseItems.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            product: {
              connect: { productId: item.productId },
            },
          })),
        },
      },
      include: {
        purchaseItems: {
          include: {
            product: true, // I want to have product details in the response
          },
        },
      },
    });

    return NextResponse.json(purchaseOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}