class ParameterValue {
    description: string
    value: string
    key: string

    constructor(description: string, value: string, key: string) {
        this.description = description
        this.value = value
        this.key = key
    }
}

export default ParameterValue;