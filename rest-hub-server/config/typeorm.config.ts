import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { processEnv } from '@/common/constants';
import { Follow } from '@/model/follow.entity';
import { Notification } from '@/model/notification.entity';
import { Post } from '@/model/post.entity';
import { PostComment } from '@/model/postComment.entity';
import { PostCommentLike } from '@/model/postCommentLike.entity';
import { PostLike } from '@/model/postLike.entity';
import { User } from '@/model/user.entity';

dotenv.config({ path: 'config/.env' });

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: processEnv.DB_HOST,
  database: processEnv.DB_NAME,
  port: Number(processEnv.DB_PORT),
  username: processEnv.DB_USERNAME,
  password: processEnv.DB_PASSWORD,
  entities: [User, Post, PostLike, PostComment, PostCommentLike, Follow, Notification],
  synchronize: true,
};
