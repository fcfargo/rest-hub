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

const isProd = processEnv.NODE_ENV === 'production';

export const typeOrmConfig: TypeOrmModuleOptions = isProd
  ? {
      type: 'postgres',
      url: processEnv.DB_URL,
      entities: [User, Post, PostLike, PostComment, PostCommentLike, Follow, Notification],
      synchronize: true,
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Post, PostLike, PostComment, PostCommentLike, Follow, Notification],
      synchronize: true,
    };
