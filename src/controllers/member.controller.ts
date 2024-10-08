import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GatewayGuard } from 'src/guard/gateway.guard';
import { MemberGuard } from 'src/guard/member.guard';
import { TypiaValidationPipe } from 'src/pipes/validation.pipe';
import { ProfileService } from 'src/services/profile.service';
import { IUpdateMemberBody } from 'src/types/profile';
import { IResponseMemberData, IReplyData } from 'src/types/response';
import { validateUpdateMemberBody } from 'src/validates/body.validate';

@Controller('member')
@UseGuards(GatewayGuard, MemberGuard)
export class MemberController {
  constructor(private profileService: ProfileService) {}

  @Get('profile')
  @HttpCode(200)
  async getProfile(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('email') email: string,
  ) {
    const profile = await this.profileService.getProfile(userId);

    const data: IResponseMemberData = {
      email,
      imageUrl: profile.image_url,
      nickname: profile.nickname,
      joinDate: profile.join_date,
      updateDate: profile.update_date,
      provider: profile.provider,
    };

    const reply: IReplyData = {
      message: 'Profile retrieved',
      data,
    };

    return reply;
  }

  @Put('profile')
  @HttpCode(200)
  async updateProfile(
    @Query('userId', ParseIntPipe) userId: number,
    @Body(new TypiaValidationPipe(validateUpdateMemberBody))
    body: IUpdateMemberBody,
  ) {
    if (body.nickname) {
      await this.profileService.updateNickname(userId, body.nickname);
    }

    if (body.imageUrl) {
      await this.profileService.updateAvatar(userId, body.imageUrl);
    }

    const reply: IReplyData = {
      message: 'Profile updated',
    };

    return reply;
  }
}
