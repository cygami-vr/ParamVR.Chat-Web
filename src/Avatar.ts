class Avatar {

    id: number
    vrcUuid: string
    name: string
    image: string

    constructor(id: number, vrcUuid: string, name: string, image: string) {
        this.id = id
        this.vrcUuid = vrcUuid
        this.name = name
        this.image = image
    }
}

export default Avatar