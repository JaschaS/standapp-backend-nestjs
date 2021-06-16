export interface Members {
    members: Member[];
}

export interface Member {
    nickName: string;
    image: string;
    key: string;
}

export interface MemberHistory {
    start: string;
    end: string;
    nickName: string;
}

export interface CurrentHost {
    start: string;
    image: string;
    nickName: string;
}