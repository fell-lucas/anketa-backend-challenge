-- CreateTable
CREATE TABLE "phone_verification_attempts" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" VARCHAR(20) NOT NULL,
    "otp" CHAR(6) NOT NULL,
    "status" TEXT NOT NULL,
    "sns_message_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "session_id" UUID,
    "user_id" UUID NOT NULL,

    CONSTRAINT "phone_verification_attempts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "phone_verification_attempts" ADD CONSTRAINT "phone_verification_attempts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_verification_attempts" ADD CONSTRAINT "phone_verification_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
