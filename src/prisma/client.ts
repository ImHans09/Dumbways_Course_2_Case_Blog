import { Prisma, PrismaClient } from "@prisma/client";

// Initialize Prisma
const prisma = Prisma;

// Create instance of PrismaClient
const prismaClient = new PrismaClient();

// Set default export for prismaClient variable
export {
  prisma,
  prismaClient
};