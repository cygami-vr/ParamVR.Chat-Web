
export interface InviteParameter {
    avatarName: string
    avatarId: number
    parameterName: string
    parameterId: number
}

export interface InviteAvatarChange {
    avatarName: string
    avatarId: number
}

export interface InviteObject {

    url: string
    expires: number
    parameters: Array<InviteParameter>
    changeableAvatars: Array<InviteAvatarChange>
}

export interface EligibleForInvite {
  parameters: Array<InviteParameter>
  changeableAvatars: Array<InviteAvatarChange>
}
