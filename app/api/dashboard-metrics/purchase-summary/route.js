import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the current date and calculate the date 5 days ago
    const today = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);

    // Fetch purchases from the last 5 days, grouped by day
    const purchaseSummary = await prisma.purchase.groupBy({
      by: ["timestamp"],
      where: {
        timestamp: {
          gte: fiveDaysAgo,
          lte: today,
        },
      },
      _sum: {
        totalAmount: true,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    console.log("Purchase summary:", purchaseSummary);

    // Format the response and calculate percentage change
    const formattedSummary = purchaseSummary.map((entry, index, array) => {
      const currentTotal = entry._sum.totalAmount || 0;
      const previousTotal = index > 0 ? array[index - 1]._sum.totalAmount || 0 : 0;

      // Calculate percentage change
      const percentageChange =
        previousTotal === 0
          ? 0 // Avoid division by zero
          : ((currentTotal - previousTotal) / previousTotal) * 100;

      return {
        date: entry.timestamp.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        totalAmount: currentTotal, // Use daily total instead of accumulated total
        percentageChange: parseFloat(percentageChange.toFixed(2)), // Round to 2 decimal places
      };
    });

    return NextResponse.json(formattedSummary, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch purchase summary", error);
    return NextResponse.json(
      { message: "Error retrieving purchase summary" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}