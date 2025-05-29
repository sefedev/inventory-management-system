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


    const sales = await prisma.sale.findMany({
      where: {
        userId
      },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(sales, { status: 200 });
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales orders' },
      { status: 500 }
    );
  }  finally {
          await prisma.$disconnect()
      }
}