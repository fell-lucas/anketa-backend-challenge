export enum MediaType {
  UserImage = 'user-image',
  PostMedia = 'post-media',
  PollMedia = 'poll-media',
  PollOptionMedia = 'poll-option-media',
  Link = 'link',
}

/**
 * Kind of media that supports also video uploads:
 */
export const SupportedMediaTypes = {
  image: [
    MediaType.UserImage,
    MediaType.PostMedia,
    MediaType.PollOptionMedia,
    MediaType.PollMedia,
  ],
  video: [MediaType.PostMedia, MediaType.PollOptionMedia, MediaType.PollMedia],
  audio: [MediaType.PostMedia, MediaType.PollOptionMedia, MediaType.PollMedia],
};
