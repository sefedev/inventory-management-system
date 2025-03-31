import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {

    const purchases = await prisma.purchase.findMany({
      include: {
        purchaseItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(purchases, { status: 200 });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  } finally {
   await prisma.$disconnect()
  }
}