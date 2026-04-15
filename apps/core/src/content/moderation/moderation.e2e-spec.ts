import { expectStatus, TestUtils } from '@repo/system/test/test.utils';
import {
  TEST_ADMIN_1,
  TEST_USER_1,
  TEST_USER_2,
} from '@repo/system/test/users.fixtures';
import { AppModule } from '../../app.module';
import { UserSeeds } from '../../iam/user/user.seeds';
import { AdminSeeds } from '../../iam/admin/admin.seeds';
import { PostSeeds } from '../../seeds/post.seeds';
import { CommentSeeds } from '../../seeds/comment.seeds';

// Helper to create a report and return the reported subject ID
async function createReportAndGetSubjectId(
  test: TestUtils,
  reporter: { token: string } & Record<string, unknown>,
  body: Record<string, unknown>,
): Promise<string> {
  const reportRes = await test.request(reporter).post('/reports').send(body);
  expectStatus(reportRes, 201);

  // Find the reported subject
  const subjectsRes = await test
    .request(TEST_ADMIN_1)
    .get('/brainbox/reported-subjects');
  // Return the most recent subject
  return subjectsRes.body.data[0].id;
}

describe('Moderation (e2e)', () => {
  const test = new TestUtils(AppModule).withDatabase([
    UserSeeds,
    AdminSeeds,
    PostSeeds,
    CommentSeeds,
  ]);

  describe('POST /brainbox/reported-subjects/:id/actions', () => {
    it('should dismiss a reported subject', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });

      const res = await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'DISMISS', reason: 'Not spam' });
      expectStatus(res, 201);
      expect(res.body.type).toBe('DISMISS');

      // Verify subject is now RESOLVED
      const subjectRes = await test
        .request(TEST_ADMIN_1)
        .get(`/brainbox/reported-subjects/${subjectId}`);
      expect(subjectRes.body.moderationStatus).toBe('RESOLVED');

      // Verify reports marked as reviewed
      expect(subjectRes.body.reports[0].hasBeenReviewed).toBe(true);
    });

    it('should suspend a post (hide it)', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });

      const res = await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({
          type: 'SUSPEND_REPORTED_SUBJECT',
          reason: 'Violates community guidelines',
          suspensionLevel: 'TEMPORARY_7_DAYS',
        });
      expectStatus(res, 201);

      // Verify the post is now hidden
      const post = await test.prismaService.post.findUnique({
        where: { id: postSeeds.publishedPost.id },
      });
      expect(post.hiddenAt).not.toBeNull();
      expect(post.hiddenUntil).not.toBeNull();
      expect(post.hiddenReason).toBe('Violates community guidelines');
    });

    it('hidden post should NOT appear in GET /posts', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });

      // Suspend the post
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({
          type: 'SUSPEND_REPORTED_SUBJECT',
          reason: 'Hidden',
          suspensionLevel: 'TEMPORARY_1_DAY',
        });

      // Try to get the post as a regular user
      const postRes = await test
        .request(TEST_USER_1)
        .get(`/posts/${postSeeds.publishedPost.id}`);
      expectStatus(postRes, 404);

      // Verify it's not in the list
      const listRes = await test.request(TEST_USER_1).get('/posts');
      expectStatus(listRes, 200);
      const postIds = listRes.body.data.map((p: any) => p.id);
      expect(postIds).not.toContain(postSeeds.publishedPost.id);
    });

    it('hidden comment should NOT appear in GET /posts/:id/comments', async () => {
      const commentSeeds = test.get(CommentSeeds);

      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'bullyingAndHarassment',
        commentId: commentSeeds.publishedPostComment1.id,
      });

      // Suspend the comment
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({
          type: 'SUSPEND_REPORTED_SUBJECT',
          reason: 'Harassment',
          suspensionLevel: 'PERMANENT',
        });

      // Check comments endpoint — publishedPostComment1 is on publishedPost
      const commentsRes = await test
        .request(TEST_USER_1)
        .get(`/posts/${commentSeeds.publishedPostComment1.postId}/comments`);
      expectStatus(commentsRes, 200);
      const commentIds = commentsRes.body.data.map((c: any) => c.id);
      expect(commentIds).not.toContain(commentSeeds.publishedPostComment1.id);
    });

    it('should unsuspend a post (restore visibility)', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });

      // Suspend first (→ RESOLVED)
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({
          type: 'SUSPEND_REPORTED_SUBJECT',
          reason: 'Temp hide',
          suspensionLevel: 'TEMPORARY_1_DAY',
        });

      // Verify hidden
      let postRes = await test
        .request(TEST_USER_1)
        .get(`/posts/${postSeeds.publishedPost.id}`);
      expectStatus(postRes, 404);

      // Reopen (RESOLVED → PENDING_REVIEW)
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'REOPEN' });

      // Escalate (PENDING_REVIEW → ESCALATED, which allows UNSUSPEND)
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'ESCALATE' });

      // Unsuspend (ESCALATED → RESOLVED)
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'UNSUSPEND_REPORTED_SUBJECT' });

      // Verify visible again
      postRes = await test
        .request(TEST_USER_1)
        .get(`/posts/${postSeeds.publishedPost.id}`);
      expectStatus(postRes, 200);
    });

    it('should suspend the user who authored a reported post', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'hateSpeech',
        postId: postSeeds.publishedPost.id,
      });

      const res = await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({
          type: 'SUSPEND_USER',
          reason: 'Repeated violations',
          suspensionLevel: 'TEMPORARY_7_DAYS',
        });
      expectStatus(res, 201);

      // Verify the post author (TEST_USER_1) is suspended
      const user = await test.prismaService.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(user.suspendedAt).not.toBeNull();
      expect(user.suspensionReason).toBe('Repeated violations');
    });

    it('should reject invalid state transition (ESCALATE on RESOLVED)', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });

      // Dismiss (→ RESOLVED)
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'DISMISS' });

      // Try ESCALATE on RESOLVED → should fail
      const res = await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'ESCALATE' });
      expectStatus(res, 422);
    });

    it('should reopen a resolved subject', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });

      // Dismiss (→ RESOLVED)
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'DISMISS' });

      // Reopen (RESOLVED → PENDING_REVIEW)
      const res = await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'REOPEN' });
      expectStatus(res, 201);

      // Verify status
      const subjectRes = await test
        .request(TEST_ADMIN_1)
        .get(`/brainbox/reported-subjects/${subjectId}`);
      expect(subjectRes.body.moderationStatus).toBe('PENDING_REVIEW');
    });

    it('should list moderation actions for a subject', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });

      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'ESCALATE' });

      const res = await test
        .request(TEST_ADMIN_1)
        .get(`/brainbox/reported-subjects/${subjectId}/actions`);
      expectStatus(res, 200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].type).toBe('ESCALATE');
    });

    it('should mark a reported post as sensitive', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'flagAsSensitive',
        postId: postSeeds.publishedPost.id,
      });

      const res = await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'MARK_AS_SENSITIVE', reason: 'Graphic content' });
      expectStatus(res, 201);

      // Verify the post is marked as sensitive
      const post = await test.prismaService.post.findUnique({
        where: { id: postSeeds.publishedPost.id },
      });
      expect(post.hasSensitiveContent).toBe(true);

      // Verify reports are marked as reviewed (resolving action)
      const subjectRes = await test
        .request(TEST_ADMIN_1)
        .get(`/brainbox/reported-subjects/${subjectId}`);
      expect(subjectRes.body.moderationStatus).toBe('RESOLVED');
      expect(subjectRes.body.reports[0].hasBeenReviewed).toBe(true);
    });

    it('should unsuspend the user who authored a reported post', async () => {
      const postSeeds = test.get(PostSeeds);
      const subjectId = await createReportAndGetSubjectId(test, TEST_USER_2, {
        type: 'hateSpeech',
        postId: postSeeds.publishedPost.id,
      });

      // Suspend the user
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({
          type: 'SUSPEND_USER',
          reason: 'Violation',
          suspensionLevel: 'TEMPORARY_1_DAY',
        });

      // Verify suspended
      let user = await test.prismaService.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(user.suspendedAt).not.toBeNull();

      // Reopen (RESOLVED → PENDING_REVIEW)
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'REOPEN' });

      // Escalate (PENDING_REVIEW → ESCALATED, which allows UNSUSPEND_USER)
      await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'ESCALATE' });

      // Unsuspend user
      const res = await test
        .request(TEST_ADMIN_1)
        .post(`/brainbox/reported-subjects/${subjectId}/actions`)
        .send({ type: 'UNSUSPEND_USER' });
      expectStatus(res, 201);

      // Verify user is no longer suspended
      user = await test.prismaService.user.findUnique({
        where: { id: TEST_USER_1.appId },
      });
      expect(user.suspendedAt).toBeNull();
      expect(user.suspensionReason).toBeNull();
    });
  });
});
