import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId")?.toString();

    console.log(userId, "USER ID>>>")

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the 10 most popular products by sales
    const popularProducts = await prisma.product.findMany({
      where: { userId },
      select: {
        productId: true,
        name: true,
        price: true,
        stockAvailable: true,
        saleItems: {
          select: {
            quantity: true,
          },
        },
      },
    });

    // Calculate total quantity sold and total accumulated sold amount
    const productsWithSalesData = popularProducts.map((product) => {
      const totalQuantitySold = product.saleItems.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      );
      const totalAccumulatedAmount = totalQuantitySold * product.price;

      return {
        productId: product.productId,
        name: product.name,
        price: product.price,
        stockQuantity: product.stockAvailable,
        totalQuantitySold,
        totalAccumulatedAmount,
      };
    });

    // Sort by total quantity sold in descending order and limit to top 10
    const topProducts = productsWithSalesData
      .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
      .slice(0, 10);
      
    return NextResponse.json(topProducts, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch popular products", error);
    return NextResponse.json(
      { message: "Error retrieving popular products" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}