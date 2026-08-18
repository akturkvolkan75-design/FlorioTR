-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Bekliyor',
    "status" TEXT NOT NULL DEFAULT 'Yeni',
    "flowerShopId" INTEGER,
    "flowerShopIdRelation" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_flowerShopId_fkey" FOREIGN KEY ("flowerShopId") REFERENCES "FlowerShop" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
