//Create Like
export { CreateLikeDto } from './create-like/create-like.form.dto';
export { CreateLikeResponseDto } from './create-like/create-like.response.dto';

//Remove Like
export { RemoveLikeDto } from './remove-like/remove-like.form.dto';
export { RemoveLikeResponseDto } from './remove-like/remove-like.response.dto';

//Post Likes
export {
  GetPostLikesResponseDto,
  PostLikesDataDto,
} from './post-likes/get-post-likes.response.dto';

//Comment Likes
export {
  GetCommentLikesResponseDto,
  CommentLikesDataDto,
} from './comment-likes/get-comment-likes.response.dto';

//User Likes
export {
  GetUserLikesResponseDto,
  UserLikesDataDto,
} from './user-likes/get-user-likes.response.dto';

//Has Liked
export { HasUserLikedQueryDto } from './has-liked/has-user-liked.query.dto';
export {
  HasUserLikedDataDto,
  HasUserLikedResponseDto,
} from './has-liked/has-user-liked.response.dto';

//Shared
export { LikeDto } from './shared/like.response.dto';
export type { LikeTargetType } from './shared/like.response.dto';
export { PostIdParamDto } from './shared/post-id-param.dto';
export { CommentIdParamDto } from './shared/comment-id-param.dto';
export { UserIdParamDto } from './shared/user-id-param.dto';
