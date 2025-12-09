# Anketa Test Project

This monoreo includes all components of the Pollpapa project:

- apps/: The Nest.js APIs
- apps/main: Main monorepo with auth, user, posting, engadgement, etc.
- example: apps/api/crypto: The Nest.js API for Crypto and pyments

Every project have a .env file that you need to create from the .env.example

Don't forget to check each project README.md for more information.

## Getting Started

Use nvm to install the correct version of node.js. See .nvmrc file.

```commandline
nvm install
nvm use
```

### Setup pnpm

```commandline
npm i -g pnpm
```

- after cloning the repo, from the root of this repo, install all dependencies with pnpm

```commandline
pnpm i
```

### Start the DEV server

Start the db first:

```commandline
pnpm db:start
```

Reset the db schema AND data (useful after breaking changes)

```commandline
pnpm dev:env
pnpm db:generate
pnpm db:reset
```

You can start all other services by entering their folder and running `pnpm dev` or run all from a single command from the root

```commandline
pnpm dev
```

After starting the db, navigate to [localhost](http://localhost:8000/)

For extra documentation, see the README.md in each app/api folder

## Tests

To run the tests, cd into apps/core and run `jest`, eg:

```commandline
cd apps/core
jest
jest reports
```

# Exercise

## Implement Reports & Moderation on Posts & Comments

## Context

Users need to be able to report other users, posts, and comments.
Admins need to be able to report users, posts, and comments; But they also need to be able to take moderation actions on reported items.
Your task is to implement both the report feature and the moderation feature for users & admins.

## What to do

- [ ] **Update Prisma schema & related generated classes** with new moderation models and enums.
- [ ] **Implement user-facing reporting implementation** for users, comments, and posts to work with the new ReportedSubject model and the Report model. A user can report a post, comment, or another user.
- [ ] **Implement admin-facing reporting implementation** for users, comments, and posts. Just like users, admins should be able to report a post, comment, or another user.
- [ ] **Implement admin-facing moderation implementation** for users, comments, and posts. Admin should be able to act on a certain reported subject (reported user, reported comment, reported post, etc.). They can escalate the issue, suspend the reported subject, etc (Suspending a post or comment means hiding it.).
- [ ] **Implement tests** to work with the new moderation implementation if needed. It should test the hidden posts are no longer visible to users, etc. Try to use the current testing infrastructures.

## Samples / Models

The following are example models designed to help you understand the task a little better. Feel free to change this implementation as you see fit.

### ReportedSubject

```plain
// Enum defining what type of content/entity is being reported
enum ReportedSubjectType {
  USER
  POST
  COMMENT
}

// Enum defining the current moderation status of a reported subject
enum ReportedSubjectModerationStatus {
  PENDING_REVIEW // Newly created or has has been re-opened or has reports and needs to be reviewed by a moderator (Admin)
  PENDING_APPEAL // The subject has been moderated (e.g., suspended, dismissed) but the reporter or reported user has appealed the decision and it needs to be reviewed again by a moderator (Admin)
  ESCALATED // The subject has been escalated to a higher level of moderation (e.g., senior moderator or admin) for further review
  UNDER_REVIEW // Currently being reviewed by a moderator (Admin)
  RESOLVED // The subject has been reviewed and appropriate action has been taken (e.g., suspension, dismissal, marked as sensitive, no acttion taken but closed, etc.)
}

// Enum defining the types of moderation actions that can be taken
enum ModerationActionType {
  ESCALATE
  MARK_AS_SENSITIVE
  MARK_AS_NOT_SENSITIVE
  DISMISS // Simply dismisses the report without action
  SUSPEND_REPORTED_SUBJECT // Suspend the reported user or content for a period of time or permanently. This is an action that requires suspension level, violation category, etc.
  SUSPEND_USER // Suspend the user related to the reported subject (e.g., the author of a reported post or comment) for a period of time or permanently. This is an action that requires suspension level, violation category, etc.
  UNSUSPEND_REPORTED_SUBJECT // Lift any suspension on the reported subject
  UNSUSPEND_USER // Lift any suspension on the user related to the reported subject
  REOPEN // Reopen a previously resolved report for further review
}

// Enum defining severity levels for suspensions
enum ModerationSuspensionLevel {
  WARNING // L0 - Warning
  TEMPORARY_1_DAY // L1 - 1 day, 24 hours suspension
  TEMPORARY_2_DAYS // L2 - 48 hours suspension
  TEMPORARY_7_DAYS // L3 - 7 days suspension
  PERMANENT // L4 - Permanent suspension
  CUSTOM // Custom duration suspension
}

// Main model representing a reported subject (user, post, or comment)
model ReportedSubject {
  id                String            @id @default(uuid()) @db.Uuid
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @default(now()) @updatedAt @map("updated_at")

  type                    ReportedSubjectType
  moderationStatus        ReportedSubjectModerationStatus

  // Optional relations depending on the subject type
  userId                  String?
  user                    User?     @relation(fields: [userId], references: [id])

  postId                  String?
  post                    Post?     @relation(fields: [postId], references: [id])

  commentId               String?
  comment                 Comment?  @relation(fields: [commentId], references: [id])

  latestReportCreatedAt   DateTime
  latestReportId          String?
  latestReport            Report?   @relation(fields: [latestReportId], references: [id], onDelete: SetNull, onUpdate: Cascade)

  // Moderation assignment
  assignedModeratorId     String? // Admin who is assigned to moderate this subject
  assignedModerator       Admin?    @relation("SubjectAssignedModerator", fields: [assignedModeratorId], references: [id])
  assignedModeratorAt     DateTime? // When the moderator was assigned

  reportsCount            Int       @default(0)
  activeReportsCount      Int       @default(0)
  moderationActionsCount  Int       @default(0)

  // Relations
  reports                 Report[]
}

// Model representing actions taken by moderators on reported subjects
model ModerationAction {
  id                String            @id @default(uuid()) @db.Uuid
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @default(now()) @updatedAt @map("updated_at")
  type              ModerationActionType
  reason            String?          // Optional reason for the action
  isEdit            Boolean          @default(false) // Whether this action is an edit of a previous action

  /// The reported subject this action is for
  reportedSubjectId  String
  reportedSubject    ReportedSubject @relation(fields: [reportedSubjectId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  /// The admin who performed this action
  performedById      String
  performedBy        Admin @relation(fields: [performedById], references: [id])

  /// Optional fields depending on action type
  violationCategory     String?
  violationSubcategory  String?
  suspensionLevel    ModerationSuspensionLevel?
  notes              String?

  /// If suspension level is custom, this is the start and end date of the suspension
  suspensionStartsAt  DateTime?
  suspensionEndsAt    DateTime?

  /// If this is rejection or approval of an appeal, we should link an appeal here below
  /// This it not implemented here yet, need to confirm with team how we wanna handle appeals first
}

// Report model to work with the new moderation system
model Report {
  id                String            @id @default(uuid()) @db.Uuid
  createdAt         DateTime          @default(now()) @map("created_at")
  updatedAt         DateTime          @default(now()) @updatedAt @map("updated_at")
  type              ReportType
  message           String?
  hasBeenReviewed   Boolean           @default(false) @map("has_been_reviewed") // Whether an admin has reviewed this report. Differentiates new reports from ones that have been looked at.

  /// Reported Subject
  reportedSubjectId String            @map("reported_subject_id") @db.Uuid
  reportedSubject   ReportedSubject  @relation(fields: [reportedSubjectId], references: [id], onDelete: Cascade, onUpdate: Cascade)

  /// Who made the report
  userId            String?            @map("user_id") @db.Uuid
  user              User?              @relation(fields: [userId], references: [id], onDelete: SetNull, onUpdate: Cascade)
  adminId           String?            @map("admin_id") @db.Uuid
  admin             Admin?             @relation(fields: [adminId], references: [id], onDelete: SetNull, onUpdate: Cascade)

  @@index([reportedSubjectId])
  @@map("reports")
}
```

## Notes

- Feel free to change this implementation as you see fit if there's anything you think can/should be done better
- The new system should maintain all existing functionality. Test if this still works as expected for users
- Much of the codebase is not in your version of the codebase, so ignore the fact that you can't see the a posts service or comments, service for example. Just make sure to implement a small simple user-facing post module & comment module to showcase & test how suspended items aren't fetched.
