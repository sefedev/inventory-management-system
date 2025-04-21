import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the current date and calculate the date 5 days ago
    const today = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);

    // Fetch sales from the last 5 days
    const sales = await prisma.sale.findMany({
      where: {
        timestamp: {
          gte: fiveDaysAgo,
          lte: today,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    // Group sales by date (ignoring time)
    const groupedSales = sales.reduce((acc, sale) => {
      const date = sale.timestamp.toISOString().split("T")[0]; // Extract date as YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = { totalAmount: 0 };
      }
      acc[date].totalAmount += sale.totalAmount;
      return acc;
    }, {});

    // Convert grouped sales into an array and calculate percentage change
    const formattedSummary = Object.entries(groupedSales)
      .map(([date, data]) => ({ date, totalAmount: data.totalAmount }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ensure dates are sorted
      .map((entry, index, array) => {
        const currentTotal = entry.totalAmount || 0;
        const previousTotal = index > 0 ? array[index - 1].totalAmount || 0 : 0;

        // Calculate percentage change
        const percentageChange =
          previousTotal === 0
            ? 0 // Avoid division by zero
            : ((currentTotal - previousTotal) / previousTotal) * 100;

        return {
          date: entry.date,
          totalAmount: currentTotal,
          percentageChange: parseFloat(percentageChange.toFixed(2)), // Round to 2 decimal places
        };
      });

    return NextResponse.json(formattedSummary, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch sales summary", error);
    return NextResponse.json(
      { message: "Error retrieving sales summary" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}