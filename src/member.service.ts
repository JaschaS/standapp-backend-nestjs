import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentHost, Member, MemberHistory, Members } from './members';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MemberService {
  
  members: Members = { members: [
  ]};
  currentHost: CurrentHost = {start: "", nickName: "", image: ""};
  history: MemberHistory[] = [
    {
      start: "",
      end: "",
      nickName: ""
    }
  ];

  getCurrentHost(): Member {
    return {key: "", nickName: this.currentHost.nickName, image: this.currentHost.image};
  }

  getMembers(): Members {
    return this.members;
  }

  saveMember(newMember: Member): Members {
    const result = this.members.members.filter(member => member.nickName === newMember.nickName)

    if(result.length == 0) {
      console.log("Add member to list");
      this.members.members.push({nickName: newMember.nickName, image: newMember.image, key: uuidv4()});
    }
    else {
      console.log("Member already given");
    }

    return this.members;
  }

  updateMember(memberName: string, updateMember: Member): Members {
    const result = this.members.members.filter(member => member.nickName === memberName);

    if(result.length == 0) {
      console.log("Member not found");
      throw new NotFoundException("Member not found");
    }

    result.map(member => {
      if(updateMember.nickName) member.nickName = updateMember.nickName;
      if(updateMember.image) member.image = updateMember.image;
    });

    if(this.currentHost.nickName === memberName) {
      console.log("update currenthost");
      if(updateMember.nickName) this.currentHost.nickName = updateMember.nickName;
      if(updateMember.image) this.currentHost.image = updateMember.image;   

      console.log(this.currentHost.nickName + " " + this.currentHost.image);
    }

    return this.members;
  }

  deleteMember(deleteMember: Member): Members {
    this.members.members = this.members.members.filter(member => member.nickName !== deleteMember.nickName)

    return this.members;
  }

  recomendHost(): Member {
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }

    const index = getRandomInt(this.members.members.length);

    console.log("recommendation " + this.members.members[index]);

    return this.members.members[index];
  }

  saveHost(newHost: Member): CurrentHost {

    const result = this.members.members.filter(member => member.nickName === newHost.nickName)

    if(result.length == 0) {
      console.log("Couldn't find given host");
      throw new NotFoundException("Couldn't find member with given name");
    }

    const currentDate = new Date();
    const startDate = currentDate.getDate() + "-" + currentDate.getMonth() + "-" +  currentDate.getFullYear();

    const historyResult = this.history.filter(e => e.nickName === this.currentHost.nickName);

    if(historyResult.length == 0) {
      this.history.push({nickName: this.currentHost.nickName, start: this.currentHost.start, end: startDate});
    } else {
      historyResult[0].end = startDate;
    }

    this.currentHost = {
      nickName: newHost.nickName,
      start: startDate,
      image: result[0].image
    };
    this.history.push({nickName: this.currentHost.nickName, start: startDate, end: ""});

    return this.currentHost;
  }

}
