-- CreateIndex
CREATE INDEX "activity_types_name_idx" ON "activity_types"("name");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "comments_post_id_created_at_idx" ON "comments"("post_id", "created_at");

-- CreateIndex
CREATE INDEX "devices_user_id_idx" ON "devices"("user_id");

-- CreateIndex
CREATE INDEX "devices_platform_device_id_idx" ON "devices"("platform_device_id");

-- CreateIndex
CREATE INDEX "follows_follower_id_idx" ON "follows"("follower_id");

-- CreateIndex
CREATE INDEX "follows_followee_id_idx" ON "follows"("followee_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "likes"("user_id");

-- CreateIndex
CREATE INDEX "likes_post_id_idx" ON "likes"("post_id");

-- CreateIndex
CREATE INDEX "likes_comment_id_idx" ON "likes"("comment_id");

-- CreateIndex
CREATE INDEX "likes_repost_id_idx" ON "likes"("repost_id");

-- CreateIndex
CREATE INDEX "phone_verification_attempts_phone_idx" ON "phone_verification_attempts"("phone");

-- CreateIndex
CREATE INDEX "poll_answers_poll_id_idx" ON "poll_answers"("poll_id");

-- CreateIndex
CREATE INDEX "poll_answers_vote_id_idx" ON "poll_answers"("vote_id");

-- CreateIndex
CREATE INDEX "poll_options_poll_id_idx" ON "poll_options"("poll_id");

-- CreateIndex
CREATE INDEX "polls_post_id_idx" ON "polls"("post_id");

-- CreateIndex
CREATE INDEX "post_bookmarks_user_id_idx" ON "post_bookmarks"("user_id");

-- CreateIndex
CREATE INDEX "post_bookmarks_post_id_idx" ON "post_bookmarks"("post_id");

-- CreateIndex
CREATE INDEX "post_mutes_user_id_idx" ON "post_mutes"("user_id");

-- CreateIndex
CREATE INDEX "post_mutes_post_id_idx" ON "post_mutes"("post_id");

-- CreateIndex
CREATE INDEX "post_sections_post_id_idx" ON "post_sections"("post_id");

-- CreateIndex
CREATE INDEX "posts_created_by_user_id_type_idx" ON "posts"("created_by_user_id", "type");

-- CreateIndex
CREATE INDEX "posts_hashtags_idx" ON "posts"("hashtags");

-- CreateIndex
CREATE INDEX "posts_status_visibility_ends_at_idx" ON "posts"("status", "visibility", "ends_at");

-- CreateIndex
CREATE INDEX "reposts_user_id_idx" ON "reposts"("user_id");

-- CreateIndex
CREATE INDEX "reposts_post_id_idx" ON "reposts"("post_id");

-- CreateIndex
CREATE INDEX "sessions_device_id_idx" ON "sessions"("device_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "token_minting_created_at_idx" ON "token_minting"("created_at");

-- CreateIndex
CREATE INDEX "user_activity_logs_user_id_idx" ON "user_activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "user_activity_logs_entity_id_idx" ON "user_activity_logs"("entity_id");

-- CreateIndex
CREATE INDEX "user_activity_logs_created_at_activity_idx" ON "user_activity_logs"("created_at", "activity");

-- CreateIndex
CREATE INDEX "user_blocks_user_id_idx" ON "user_blocks"("user_id");

-- CreateIndex
CREATE INDEX "user_blocks_target_user_id_idx" ON "user_blocks"("target_user_id");

-- CreateIndex
CREATE INDEX "user_mutes_user_id_idx" ON "user_mutes"("user_id");

-- CreateIndex
CREATE INDEX "user_mutes_target_user_id_idx" ON "user_mutes"("target_user_id");

-- CreateIndex
CREATE INDEX "votes_post_id_idx" ON "votes"("post_id");

-- CreateIndex
CREATE INDEX "votes_user_id_idx" ON "votes"("user_id");
