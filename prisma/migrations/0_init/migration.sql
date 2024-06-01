-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "uid" INTEGER,
    "question" TEXT,
    "answer" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "name" VARCHAR(255),
    "q_header" TEXT,
    "q_open" BOOLEAN,
    "box_open" BOOLEAN,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

