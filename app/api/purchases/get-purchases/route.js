import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const {searchParams} = new URL(req.url)
    const userId = searchParams.get('userId')?.toString()
    
    // Validate UserID
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        userId,
      },
      include: {
        purchaseItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
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