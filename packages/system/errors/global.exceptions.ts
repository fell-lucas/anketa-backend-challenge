import {
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

/**
 * Error messages from this class are shown to the user instead of the generic error message.
 */
export class UserError extends HttpException {
  constructor(message: UserErrorsEnum) {
    super(message, 400)
  }
  getResponse() {
    return {
      error: 'User Error',
      message: this.message,
      statusCode: this.getStatus(),
    }
  }
}

export enum UserErrorsEnum {
  USERNAME_ALREADY_EXISTS = 'username_already_exists',
  EMAIL_ALREADY_EXISTS = 'email_already_exists',
  USERNAME_INVALID = 'username_invalid',
  POST_BOTH_POLL_AND_EXISTING_POLL_ID = 'post_both_poll_and_existing_poll_id',
  POST_POLL_NOT_FOUND = 'post_poll_not_found',
  PHONE_NUMBER_WAITING_FOR_RETRY = 'phone_number_waiting_for_retry',
  PHONE_NUMBER_TOO_MANY_ATTEMPTS = 'phone_number_too_many_attempts',
  POST_PUBLISHED_CANT_UPDATE_FIELD = 'post_published_cant_update_field',
  POST_PUBLISH_AND_SCHEDULED_AT_NOT_ALLOWED = 'post_publish_and_scheduled_at_not_allowed',
  POST_ALREADY_PUBLISHED = 'post_already_published',
  ONLY_ONE_LATITUDE_LONGITUDE = 'only_one_latitude_longitude',
  MEDIA_NOT_FOUND = 'media_not_found',
  MEDIA_ALREADY_EXISTS = 'media_already_exists',
  LINK_TYPE_NOT_SUPPORTED_FOR_UPLOAD = 'link_type_not_supported_for_upload',
  CHANNEL_NOT_FOUND = 'channel_not_found',
  CHANNEL_DISABLED = 'channel_disabled',
  POST_POLL_SINGLE_POLL_REQUIRED = 'Post type POLL can only have one poll',
  CANNOT_FOLLOW_SELF = 'cannot_follow_self',
  ALREADY_FOLLOWING = 'already_following',
  FOLLOW_REQUEST_COOLDOWN = 'follow_request_cooldown',
  UNAUTHORIZED_ACTION = 'unauthorized_action',
  INVALID_FOLLOW_STATUS = 'invalid_follow_status',
  CANNOT_BLOCK_SELF = 'cannot_block_self',
  ALREADY_BLOCKED = 'already_blocked',
  CANNOT_MUTE_SELF = 'cannot_mute_self',
  ALREADY_MUTED = 'already_muted',
  POST_OF_BLOCKED_USER = 'post_of_blocked_user',
  POST_ALREADY_LIKED = 'post_already_liked',
  COMMENT_ALREADY_LIKED = 'comment_already_liked',
  POST_OF_MUTED_USER = 'post_of_muted_user',
  ALREADY_REPOSTED = 'already_reposted',
  POST_STATUS_NOT_ALLOWED_FOR_OTHER_USERS = 'post_status_not_allowed_for_other_users',
  INVALID_PARENT_COMMENT = 'invalid_parent_comment',
  USER_ALREADY_VOTED = 'user_already_voted',
  INVALID_POLL_ID = 'invalid_poll_id',
  INVALID_POLL_OPTION_ID = 'invalid_poll_option_id',
  MULTIPLE_ANSWERS_NOT_ALLOWED = 'multiple_answers_not_allowed',
  INVALID_SECTION_REFERENCE = 'invalid_section_reference',
  INVALID_POLL_REFERENCE = 'invalid_poll_reference',
  POST_REFERENCE_ID_NOT_UNIQUE = 'post_reference_id_not_unique',
  ALREADY_BOOKMARKED = 'already_bookmarked',
  USER_SETTINGS_NOT_FOUND = 'user_settings_not_found',
  PIN_CODE_NOT_SET = 'pin_code_not_set',
  INVALID_PLATFORM_VARIABLE_NAME = 'invalid_platform_variable_name',
  INVALID_ACTIVITY = 'invalid_activity',
  NO_ELIGIBLE_USERS_FOUND_WITH_POINTS = 'no_eligible_users_found_with_points',
  TYPE_NOT_SUPPORTED_FOR_UPLOAD = 'type_not_supported_for_upload',
  ANSWER_CHARACTER_LIMIT_EXCEEDED = 'answer_character_limit_exceeded',
  POST_NOT_PUBLISHED = 'post_not_published',
  MISSING_POST_ID = 'missing_post_id',
  MISSING_COMMENT_ID = 'missing_comment_id',
  MISSING_USER_ID = 'missing_user_id',
  MAX_SUMMARIES_PER_REQUEST = 'max_summaries_per_request',
  POST_CLOSED = 'post_closed',
}

export enum ExceptionUnauthorizedEnum {
  MISSING_ACCESS_TOKEN = 'missing_access_token',
  INVALID_ACCESS_TOKEN = 'invalid_access_token',
  MISSING_USER_AGENT = 'missing_user_agent',
  MISSING_PLATFORM_DEVICE_ID = 'missing_platform_device_id',
  MISSING_USER = 'missing_user',
  USER_NOT_REGISTERED = 'user_not_registered',
  PHONE_NUMBER_ALREADY_BELONGS_TO_USER = 'phone_number_already_belongs_to_user',
  PHONE_NUMBER_NOT_FOUND = 'phone_number_not_found',
  PHONE_NUMBER_EXPIRED = 'phone_number_expired',
  PHONE_NUMBER_NOT_BELONGS_TO_SESSION = 'phone_number_not_belongs_to_session',
  PHONE_NUMBER_CODE_NOT_MATCH = 'phone_number_code_not_match',
  PHONE_NUMBER_ALREADY_VERIFIED = 'phone_number_already_verified',
  PHONE_NUMBER_VERIFICATION_NOT_FOUND = 'phone_number_verification_not_found',
  MISSING_EMAIL = 'missing_email',
  SIGN_UP_TEMPORARILY_RESTRICTED = 'sign_up_temporarily_restricted',
}

export class AppUnauthorizedException extends UnauthorizedException {
  constructor(message: ExceptionUnauthorizedEnum) {
    super(message)
  }
}

export enum ExceptionForbiddenEnum {
  POST_NOT_BELONGS_TO_USER = 'post_not_belongs_to_user',
  POST_NOT_ACCESSIBLE = 'post_not_accessible',
  COMMENT_NOT_BELONGS_TO_USER = 'comment_not_belongs_to_user',
  RATING_NOT_BELONGS_TO_USER = 'rating_not_belongs_to_user',
}

export class AppForbiddenException extends ForbiddenException {
  constructor(message: ExceptionForbiddenEnum) {
    super(message)
  }
}

export enum AppNotFoundEnum {
  POST_NOT_FOUND = 'post_not_found',
  POLL_NOT_FOUND = 'poll_not_found',
  USER_NOT_FOUND = 'user_not_found',
  FOLLOW_NOT_FOUND = 'follow_not_found',
  BLOCK_NOT_FOUND = 'block_not_found',
  MUTE_NOT_FOUND = 'mute_not_found',
  LIKE_NOT_FOUND = 'like_not_found',
  REPOST_NOT_FOUND = 'REPOST_NOT_FOUND',
  COMMENT_NOT_FOUND = 'comment_not_found',
  BOOKMARK_NOT_FOUND = 'bookmark_not_found',
  PLATFORM_VARIABLE_NOT_FOUND = 'platform_variable_not_found',
  OPTION_NOT_FOUND = 'option_not_found',
  VOTE_NOT_FOUND = 'vote_not_found',
  POLL_RATING_NOT_FOUND = 'poll_rating_not_found',
  POST_RATING_NOT_FOUND = 'post_rating_not_found',
  USER_ACCOUNT_SUSPENDED = 'user_account_suspended',
}

export class AppNotFoundException extends NotFoundException {
  constructor(message: AppNotFoundEnum) {
    super(message)
  }
}

export enum AppErrorsEnum {
  INTERNAL_SERVER_ERROR = 'internal_server_error',
  APPLE_NOT_ENABLED = 'apple_not_enabled',
  GOOGLE_CLIENT_NOT_INITIALIZED = 'google_client_not_initialized',
  PLATFORM_VARIABLE_NOT_FOUND = 'platform_variable_not_found',
}

export class AppError extends InternalServerErrorException {
  constructor(message: AppErrorsEnum = AppErrorsEnum.INTERNAL_SERVER_ERROR) {
    super(message)
  }
}
