import type ParameterValue from '@/ParameterValue'

class ParameterObject {

    description: string
    name: string
    key: string
    type: number
    dataType: number
    avatarName: string
    avatarVrcUuid: string
    defaultValue: string
    minValue: string
    maxValue: string
    values: Array<ParameterValue> = []
    value: string = ''
    parameterId: number
    image: string = ''
    
    constructor(description: string, name: string, key: string, type: number, dataType: number,
         avatarName: string, avatarVrcUuid: string, defaultValue: string, minValue: string, maxValue: string,
         parameterId: number, values?: Array<ParameterValue>) {

        this.description = description
        this.name = name
        this.key = key
        this.type = type
        this.dataType = dataType
        this.avatarName = avatarName
        this.avatarVrcUuid = avatarVrcUuid
        this.defaultValue = defaultValue
        this.minValue = minValue
        this.maxValue = maxValue
        this.parameterId = parameterId

        if (values) {
            this.values = values
        }
    }

    typeString() {
        switch (this.type) {
            case 1:
                return "list of values"
            case 2:
                return "toggle"
            case 3:
                return "slider"
        }
    }

    dataTypeString() {
        switch (this.dataType) {
            case 1:
                return "integer"
            case 2:
                return "decimal"
            case 3:
                return "boolean"
        }
    }
}

export default ParameterObject