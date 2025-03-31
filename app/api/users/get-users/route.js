import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany()
        console.log(users)

        return NextResponse.json(users, {status: 200})
    } catch (error) {
        console.error("Failed to fetch users", error)
        
        return NextResponse.json(
            {error: "Failed to fetch users"},
            {status: 500}
        )
    } finally {
        await prisma.$disconnect()
    }
}