-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "_ChoiceToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChoiceToUser_AB_unique" ON "_ChoiceToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChoiceToUser_B_index" ON "_ChoiceToUser"("B");

-- AddForeignKey
ALTER TABLE "_ChoiceToUser" ADD CONSTRAINT "_ChoiceToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Choice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChoiceToUser" ADD CONSTRAINT "_ChoiceToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
