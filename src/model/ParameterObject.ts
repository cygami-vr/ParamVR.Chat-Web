import type ParameterValue from '@/model/ParameterValue'

interface ParameterObject {

    description: string
    name: string
    requiresInvite: string
    type: number
    dataType: number
    avatarName: string
    avatarVrcUuid: string
    defaultValue: string
    minValue: string
    maxValue: string
    pressValue: string
    values: Array<ParameterValue>
    value: string
    parameterId: number
    saved: string
    lockable: string
    locked: boolean
    lockKey: string
    order: number
    image: string
}

export default ParameterObject