import { Delete, Param, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller, Get, Patch } from '@nestjs/common';
import { MemberService } from './member.service';
import { CurrentHost, Member, Members } from './members';

@Controller('/standup/v1')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('members')
  getMembers(): Members {
      return this.memberService.getMembers();
  }

  @Get('current')
  getCurrentHost(): Member {
      return this.memberService.getCurrentHost();
  }

  @Get('recommend')
  getRecommendation(): Member {
      return this.memberService.recomendHost();
  }

  @Post('member')
  getMember(@Body() newMember: Member): Members {
      return this.memberService.saveMember(newMember);
  }

  @Post('host')
  saveHost(@Body() newHost: Member): CurrentHost {
      return this.memberService.saveHost(newHost);
  }

  @Delete('member')
  removeMember(@Body() deleteMember: Member): Members {
      return this.memberService.deleteMember(deleteMember);
  }

  @Patch('member/:memberName')
  updateMember(@Param() params, @Body() newMember: Member): Members {
    return this.memberService.updateMember(params.memberName, newMember);
  }

}
