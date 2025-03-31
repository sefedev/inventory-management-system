import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
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