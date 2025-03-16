import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { jwtPayLoad } from './jwt.payload';

import { processEnv } from '@/common/constants';
import { User } from '@/model/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    super();
  }

  private validateToken = (token: string) => {
    try {
      const verify = this.jwtService.verify(token, { secret: processEnv.JWT_SECRET });
      return verify;
    } catch (err) {
      switch (err.message) {
        case 'jwt expired':
        case 'invalid token':
        case 'jwt malformed':
        case 'jwt signature is required':
        case 'invalid signature':
          throw new UnauthorizedException(err.message);
        default:
          throw new InternalServerErrorException('Jwt Validation Failed');
      }
    }
  };

  canActivate = async (context: ExecutionContext): Promise<boolean> => {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    const xAuthToken = request.headers['x-auth-token'];
    let userData: jwtPayLoad | undefined;

    if (!authorization && !xAuthToken) {
      throw new ForbiddenException('Token Have Not');
    }

    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      const { sub, email } = this.validateToken(token);
      userData = { sub, email };
    }

    if (xAuthToken) {
      const { sub, email } = this.validateToken(xAuthToken);
      userData = { sub, email };
    }

    if (userData) {
      const userId = userData.sub;
      const user = await this.usersRepository.findOne({
        where: { id: userId, deletedAt: IsNull() },
      });
      if (!user) {
        throw new ForbiddenException('User is not Exist');
      }
      request.user = userData;
      return true;
    } else {
      throw new ForbiddenException('Token is wrong');
    }
  };
}
