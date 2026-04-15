import { EmailTemplateRelations as _EmailTemplateRelations } from './email_template_relations';
import { ChannelRelations as _ChannelRelations } from './channel_relations';
import { CheckmarkRelations as _CheckmarkRelations } from './checkmark_relations';
import { CircleMembershipRelations as _CircleMembershipRelations } from './circle_membership_relations';
import { CircleRelations as _CircleRelations } from './circle_relations';
import { CommentRelations as _CommentRelations } from './comment_relations';
import { FollowRelations as _FollowRelations } from './follow_relations';
import { LikeRelations as _LikeRelations } from './like_relations';
import { UserBlockRelations as _UserBlockRelations } from './user_block_relations';
import { UserMuteRelations as _UserMuteRelations } from './user_mute_relations';
import { PostMuteRelations as _PostMuteRelations } from './post_mute_relations';
import { PostBookmarkRelations as _PostBookmarkRelations } from './post_bookmark_relations';
import { NotificationRelations as _NotificationRelations } from './notification_relations';
import { PostSearchRelations as _PostSearchRelations } from './post_search_relations';
import { PostRatingRelations as _PostRatingRelations } from './post_rating_relations';
import { UserRelations as _UserRelations } from './user_relations';
import { UserStatsRelations as _UserStatsRelations } from './user_stats_relations';
import { AdminRelations as _AdminRelations } from './admin_relations';
import { DeviceRelations as _DeviceRelations } from './device_relations';
import { SessionRelations as _SessionRelations } from './session_relations';
import { UserSettingsRelations as _UserSettingsRelations } from './user_settings_relations';
import { PhoneVerificationAttemptRelations as _PhoneVerificationAttemptRelations } from './phone_verification_attempt_relations';
import { UserProfileInformationRelations as _UserProfileInformationRelations } from './user_profile_information_relations';
import { PlatformVariablesRelations as _PlatformVariablesRelations } from './platform_variables_relations';
import { AIAnswerSummaryRelations as _AIAnswerSummaryRelations } from './ai_answer_summary_relations';
import { AIPostSummaryRelations as _AIPostSummaryRelations } from './ai_post_summary_relations';
import { MediaRelations as _MediaRelations } from './media_relations';
import { ReportedSubjectRelations as _ReportedSubjectRelations } from './reported_subject_relations';
import { ReportRelations as _ReportRelations } from './report_relations';
import { ReportedSubjectModerationRelations as _ReportedSubjectModerationRelations } from './reported_subject_moderation_relations';
import { ModerationActionRelations as _ModerationActionRelations } from './moderation_action_relations';
import { PollOptionRelations as _PollOptionRelations } from './poll_option_relations';
import { PollRelations as _PollRelations } from './poll_relations';
import { PostRelations as _PostRelations } from './post_relations';
import { RepostRelations as _RepostRelations } from './repost_relations';
import { VoteRelations as _VoteRelations } from './vote_relations';
import { PollAnswerRelations as _PollAnswerRelations } from './poll_answer_relations';
import { PollResultRelations as _PollResultRelations } from './poll_result_relations';
import { PostSectionRelations as _PostSectionRelations } from './post_section_relations';
import { WalletRelations as _WalletRelations } from './wallet_relations';
import { ActivityTypeRelations as _ActivityTypeRelations } from './activity_type_relations';
import { UserActivityLogRelations as _UserActivityLogRelations } from './user_activity_log_relations';
import { TokenMintingRelations as _TokenMintingRelations } from './token_minting_relations';
import { UserAwardedTokensRelations as _UserAwardedTokensRelations } from './user_awarded_tokens_relations';
import { EmailTemplate as _EmailTemplate } from './email_template';
import { Channel as _Channel } from './channel';
import { Checkmark as _Checkmark } from './checkmark';
import { CircleMembership as _CircleMembership } from './circle_membership';
import { Circle as _Circle } from './circle';
import { Comment as _Comment } from './comment';
import { Follow as _Follow } from './follow';
import { Like as _Like } from './like';
import { UserBlock as _UserBlock } from './user_block';
import { UserMute as _UserMute } from './user_mute';
import { PostMute as _PostMute } from './post_mute';
import { PostBookmark as _PostBookmark } from './post_bookmark';
import { Notification as _Notification } from './notification';
import { PostSearch as _PostSearch } from './post_search';
import { PostRating as _PostRating } from './post_rating';
import { User as _User } from './user';
import { UserStats as _UserStats } from './user_stats';
import { Admin as _Admin } from './admin';
import { Device as _Device } from './device';
import { Session as _Session } from './session';
import { UserSettings as _UserSettings } from './user_settings';
import { PhoneVerificationAttempt as _PhoneVerificationAttempt } from './phone_verification_attempt';
import { UserProfileInformation as _UserProfileInformation } from './user_profile_information';
import { PlatformVariables as _PlatformVariables } from './platform_variables';
import { AIAnswerSummary as _AIAnswerSummary } from './ai_answer_summary';
import { AIPostSummary as _AIPostSummary } from './ai_post_summary';
import { Media as _Media } from './media';
import { ReportedSubject as _ReportedSubject } from './reported_subject';
import { Report as _Report } from './report';
import { ReportedSubjectModeration as _ReportedSubjectModeration } from './reported_subject_moderation';
import { ModerationAction as _ModerationAction } from './moderation_action';
import { PollOption as _PollOption } from './poll_option';
import { Poll as _Poll } from './poll';
import { Post as _Post } from './post';
import { Repost as _Repost } from './repost';
import { Vote as _Vote } from './vote';
import { PollAnswer as _PollAnswer } from './poll_answer';
import { PollResult as _PollResult } from './poll_result';
import { PostSection as _PostSection } from './post_section';
import { Wallet as _Wallet } from './wallet';
import { ActivityType as _ActivityType } from './activity_type';
import { UserActivityLog as _UserActivityLog } from './user_activity_log';
import { TokenMinting as _TokenMinting } from './token_minting';
import { UserAwardedTokens as _UserAwardedTokens } from './user_awarded_tokens';

export namespace PrismaModel {
  export class EmailTemplateRelations extends _EmailTemplateRelations {}
  export class ChannelRelations extends _ChannelRelations {}
  export class CheckmarkRelations extends _CheckmarkRelations {}
  export class CircleMembershipRelations extends _CircleMembershipRelations {}
  export class CircleRelations extends _CircleRelations {}
  export class CommentRelations extends _CommentRelations {}
  export class FollowRelations extends _FollowRelations {}
  export class LikeRelations extends _LikeRelations {}
  export class UserBlockRelations extends _UserBlockRelations {}
  export class UserMuteRelations extends _UserMuteRelations {}
  export class PostMuteRelations extends _PostMuteRelations {}
  export class PostBookmarkRelations extends _PostBookmarkRelations {}
  export class NotificationRelations extends _NotificationRelations {}
  export class PostSearchRelations extends _PostSearchRelations {}
  export class PostRatingRelations extends _PostRatingRelations {}
  export class UserRelations extends _UserRelations {}
  export class UserStatsRelations extends _UserStatsRelations {}
  export class AdminRelations extends _AdminRelations {}
  export class DeviceRelations extends _DeviceRelations {}
  export class SessionRelations extends _SessionRelations {}
  export class UserSettingsRelations extends _UserSettingsRelations {}
  export class PhoneVerificationAttemptRelations extends _PhoneVerificationAttemptRelations {}
  export class UserProfileInformationRelations extends _UserProfileInformationRelations {}
  export class PlatformVariablesRelations extends _PlatformVariablesRelations {}
  export class AIAnswerSummaryRelations extends _AIAnswerSummaryRelations {}
  export class AIPostSummaryRelations extends _AIPostSummaryRelations {}
  export class MediaRelations extends _MediaRelations {}
  export class ReportedSubjectRelations extends _ReportedSubjectRelations {}
  export class ReportRelations extends _ReportRelations {}
  export class ReportedSubjectModerationRelations extends _ReportedSubjectModerationRelations {}
  export class ModerationActionRelations extends _ModerationActionRelations {}
  export class PollOptionRelations extends _PollOptionRelations {}
  export class PollRelations extends _PollRelations {}
  export class PostRelations extends _PostRelations {}
  export class RepostRelations extends _RepostRelations {}
  export class VoteRelations extends _VoteRelations {}
  export class PollAnswerRelations extends _PollAnswerRelations {}
  export class PollResultRelations extends _PollResultRelations {}
  export class PostSectionRelations extends _PostSectionRelations {}
  export class WalletRelations extends _WalletRelations {}
  export class ActivityTypeRelations extends _ActivityTypeRelations {}
  export class UserActivityLogRelations extends _UserActivityLogRelations {}
  export class TokenMintingRelations extends _TokenMintingRelations {}
  export class UserAwardedTokensRelations extends _UserAwardedTokensRelations {}
  export class EmailTemplate extends _EmailTemplate {}
  export class Channel extends _Channel {}
  export class Checkmark extends _Checkmark {}
  export class CircleMembership extends _CircleMembership {}
  export class Circle extends _Circle {}
  export class Comment extends _Comment {}
  export class Follow extends _Follow {}
  export class Like extends _Like {}
  export class UserBlock extends _UserBlock {}
  export class UserMute extends _UserMute {}
  export class PostMute extends _PostMute {}
  export class PostBookmark extends _PostBookmark {}
  export class Notification extends _Notification {}
  export class PostSearch extends _PostSearch {}
  export class PostRating extends _PostRating {}
  export class User extends _User {}
  export class UserStats extends _UserStats {}
  export class Admin extends _Admin {}
  export class Device extends _Device {}
  export class Session extends _Session {}
  export class UserSettings extends _UserSettings {}
  export class PhoneVerificationAttempt extends _PhoneVerificationAttempt {}
  export class UserProfileInformation extends _UserProfileInformation {}
  export class PlatformVariables extends _PlatformVariables {}
  export class AIAnswerSummary extends _AIAnswerSummary {}
  export class AIPostSummary extends _AIPostSummary {}
  export class Media extends _Media {}
  export class ReportedSubject extends _ReportedSubject {}
  export class Report extends _Report {}
  export class ReportedSubjectModeration extends _ReportedSubjectModeration {}
  export class ModerationAction extends _ModerationAction {}
  export class PollOption extends _PollOption {}
  export class Poll extends _Poll {}
  export class Post extends _Post {}
  export class Repost extends _Repost {}
  export class Vote extends _Vote {}
  export class PollAnswer extends _PollAnswer {}
  export class PollResult extends _PollResult {}
  export class PostSection extends _PostSection {}
  export class Wallet extends _Wallet {}
  export class ActivityType extends _ActivityType {}
  export class UserActivityLog extends _UserActivityLog {}
  export class TokenMinting extends _TokenMinting {}
  export class UserAwardedTokens extends _UserAwardedTokens {}

  export const extraModels = [
    EmailTemplateRelations,
    ChannelRelations,
    CheckmarkRelations,
    CircleMembershipRelations,
    CircleRelations,
    CommentRelations,
    FollowRelations,
    LikeRelations,
    UserBlockRelations,
    UserMuteRelations,
    PostMuteRelations,
    PostBookmarkRelations,
    NotificationRelations,
    PostSearchRelations,
    PostRatingRelations,
    UserRelations,
    UserStatsRelations,
    AdminRelations,
    DeviceRelations,
    SessionRelations,
    UserSettingsRelations,
    PhoneVerificationAttemptRelations,
    UserProfileInformationRelations,
    PlatformVariablesRelations,
    AIAnswerSummaryRelations,
    AIPostSummaryRelations,
    MediaRelations,
    ReportedSubjectRelations,
    ReportRelations,
    ReportedSubjectModerationRelations,
    ModerationActionRelations,
    PollOptionRelations,
    PollRelations,
    PostRelations,
    RepostRelations,
    VoteRelations,
    PollAnswerRelations,
    PollResultRelations,
    PostSectionRelations,
    WalletRelations,
    ActivityTypeRelations,
    UserActivityLogRelations,
    TokenMintingRelations,
    UserAwardedTokensRelations,
    EmailTemplate,
    Channel,
    Checkmark,
    CircleMembership,
    Circle,
    Comment,
    Follow,
    Like,
    UserBlock,
    UserMute,
    PostMute,
    PostBookmark,
    Notification,
    PostSearch,
    PostRating,
    User,
    UserStats,
    Admin,
    Device,
    Session,
    UserSettings,
    PhoneVerificationAttempt,
    UserProfileInformation,
    PlatformVariables,
    AIAnswerSummary,
    AIPostSummary,
    Media,
    ReportedSubject,
    Report,
    ReportedSubjectModeration,
    ModerationAction,
    PollOption,
    Poll,
    Post,
    Repost,
    Vote,
    PollAnswer,
    PollResult,
    PostSection,
    Wallet,
    ActivityType,
    UserActivityLog,
    TokenMinting,
    UserAwardedTokens,
  ];
}
