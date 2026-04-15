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

describe('Reports (e2e)', () => {
  const test = new TestUtils(AppModule).withDatabase([
    UserSeeds,
    AdminSeeds,
    PostSeeds,
    CommentSeeds,
  ]);

  describe('POST /reports (user)', () => {
    it('should create a report on a post', async () => {
      const postSeeds = test.get(PostSeeds);
      // User 2 reports User 1's published post
      const res = await test.request(TEST_USER_2).post('/reports').send({
        type: 'spam',
        message: 'This is spam',
        postId: postSeeds.publishedPost.id,
      });
      expectStatus(res, 201);
      expect(res.body).toMatchObject({
        type: 'spam',
        message: 'This is spam',
        userId: TEST_USER_2.appId,
      });
    });

    it('should create a report on a comment', async () => {
      const commentSeeds = test.get(CommentSeeds);
      const res = await test.request(TEST_USER_2).post('/reports').send({
        type: 'bullyingAndHarassment',
        commentId: commentSeeds.publishedPostComment1.id,
      });
      expectStatus(res, 201);
      expect(res.body.userId).toBe(TEST_USER_2.appId);
    });

    it('should create a report on a user', async () => {
      const userSeeds = test.get(UserSeeds);
      // User 2 reports User 1
      const res = await test.request(TEST_USER_2).post('/reports').send({
        type: 'hateSpeech',
        userId: userSeeds.user1.id,
      });
      expectStatus(res, 201);
    });

    it('should reject report with no subject ID', async () => {
      const res = await test.request(TEST_USER_1).post('/reports').send({
        type: 'spam',
      });
      expectStatus(res, 400);
    });

    it('should reject report with multiple subject IDs', async () => {
      const postSeeds = test.get(PostSeeds);
      const userSeeds = test.get(UserSeeds);
      const res = await test.request(TEST_USER_1).post('/reports').send({
        type: 'spam',
        postId: postSeeds.publishedPost.id,
        userId: userSeeds.user2.id,
      });
      expectStatus(res, 400);
    });

    it('should reject self-report on own post', async () => {
      const postSeeds = test.get(PostSeeds);
      // TEST_USER_1 is the author of publishedPost
      const res = await test.request(TEST_USER_1).post('/reports').send({
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });
      expectStatus(res, 403);
    });

    it('should reject duplicate report from same user', async () => {
      const postSeeds = test.get(PostSeeds);
      // First report
      const res1 = await test.request(TEST_USER_2).post('/reports').send({
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });
      expectStatus(res1, 201);

      // Duplicate
      const res2 = await test.request(TEST_USER_2).post('/reports').send({
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });
      expectStatus(res2, 409);
    });

    it('should reject report on nonexistent post', async () => {
      const res = await test.request(TEST_USER_1).post('/reports').send({
        type: 'spam',
        postId: '99999999-9999-9999-9999-999999999999',
      });
      expectStatus(res, 404);
    });
  });

  describe('POST /brainbox/reports (admin)', () => {
    it('should create a report as admin', async () => {
      const postSeeds = test.get(PostSeeds);
      const res = await test
        .request(TEST_ADMIN_1)
        .post('/brainbox/reports')
        .send({
          type: 'spam',
          postId: postSeeds.publishedPost.id,
        });
      expectStatus(res, 201);
      expect(res.body.adminId).toBe(TEST_ADMIN_1.appId);
      expect(res.body.userId).toBeNull();
    });
  });

  describe('GET /brainbox/reported-subjects (admin)', () => {
    it('should list reported subjects', async () => {
      const postSeeds = test.get(PostSeeds);
      // Create a report first
      await test.request(TEST_USER_2).post('/reports').send({
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });

      const res = await test
        .request(TEST_ADMIN_1)
        .get('/brainbox/reported-subjects');
      expectStatus(res, 200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.meta).toBeDefined();
    });

    it('should get a specific reported subject with details', async () => {
      const postSeeds = test.get(PostSeeds);
      // Create a report first
      await test.request(TEST_USER_2).post('/reports').send({
        type: 'spam',
        postId: postSeeds.publishedPost.id,
      });

      // Get the subject
      const subjectRes = await test
        .request(TEST_ADMIN_1)
        .get('/brainbox/reported-subjects');
      const subject = subjectRes.body.data[0];

      const detailRes = await test
        .request(TEST_ADMIN_1)
        .get(`/brainbox/reported-subjects/${subject.id}`);
      expectStatus(detailRes, 200);
      expect(detailRes.body.reports.length).toBeGreaterThanOrEqual(1);
    });
  });
});
