import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * This method is called by Passport after it successfully validates the token's signature and expiration.
   * The payload is the decoded JSON from the JWT.
   * Whatever we return here will be attached to the Request object as `req.user`.
   * @param payload The decoded JWT payload (e.g., { email, sub, name })
   */
  validate(payload: any) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}
