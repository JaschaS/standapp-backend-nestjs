import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentHost, Member, MemberHistory, Members, RecommendHost } from './members';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MemberService {
  
  members: Members = { members: [
    {
      key: uuidv4(),
      nickName: "Andreas",
      image: "images/Avatar01-1.png"
    }
  ]};
  currentHost: RecommendHost = {start: "15-6-2021", nickName: "Andreas", image: "images/Avatar01-1.png", end: "18-6-2021"};
  history: MemberHistory[] = [
    {
      start: "15-6-2021",
      end: "18-6-2021",
      nickName: "Andreas"
    }
  ];

  getCurrentHost(): RecommendHost {
    return this.currentHost;
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

  recomendHost(): RecommendHost {
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }

    const index = getRandomInt(this.members.members.length);

    console.log("recommendation " + this.members.members[index]);

    const timeSplit = this.currentHost.end.split('-');

    const currentHostEnd = new Date(new Date(+timeSplit[2], +timeSplit[1]-1, +timeSplit[0]+1));
    const currentDate = new Date(currentHostEnd.getTime() + (2 * 24 * 60 * 60 * 1000));
    const endDate = new Date(currentDate.getTime() + (4 * 24 * 60 * 60 * 1000));

    return {
      start: currentDate.getDate() + "-" + (currentDate.getMonth()+1) + "-" +  currentDate.getFullYear(),
      end: endDate.getDate() + "-" + (endDate.getMonth()+1) + "-" +  endDate.getFullYear(),
      ...this.members.members[index]
    };
  }

  saveHost(newHost: RecommendHost): RecommendHost {

    const result = this.members.members.filter(member => member.nickName === newHost.nickName)

    if(result.length == 0) {
      console.log("Couldn't find given host");
      throw new NotFoundException("Couldn't find member with given name");
    }

    const historyResult = this.history.filter(e => e.nickName === this.currentHost.nickName);

    if(historyResult.length == 0) {
      this.history.push({nickName: this.currentHost.nickName, start: this.currentHost.start, end: this.currentHost.end});
    }

    this.currentHost = {
      nickName: newHost.nickName,
      start: newHost.start,
      end: newHost.end,
      image: result[0].image
    };
    this.history.push({nickName: this.currentHost.nickName, start: this.currentHost.start, end: this.currentHost.end});

    return this.currentHost;
  }

}
