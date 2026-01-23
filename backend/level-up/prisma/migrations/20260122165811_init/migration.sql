-- This migration adds Badge and UserBadge tables that were missing from previous migrations
-- It's idempotent to handle cases where migrations were partially applied

-- CreateTable (idempotent) - Only create Badge table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Badge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable (idempotent) - Only create UserBadge table if it doesn't exist
CREATE TABLE IF NOT EXISTS "UserBadge" (
    "user_id" INTEGER NOT NULL,
    "badge_id" INTEGER NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("user_id","badge_id")
);

-- CreateIndex (idempotent) - Only create index if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS "Badge_criteria_key" ON "Badge"("criteria");

-- AddForeignKey (idempotent) - Only add foreign keys if they don't exist
DO $$ BEGIN
    ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey (idempotent)
DO $$ BEGIN
    ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
