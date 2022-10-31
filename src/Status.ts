class Status {

    connected?: boolean
    muted?: boolean
    isPancake?: boolean
    avatar?: string
    image?: string
    afk?: boolean
    active?: boolean
    vrcOpen?: boolean
    
    constructor(connected?: boolean, muted?: boolean, isPancake?: boolean, avatar?: string,
         afk?: boolean, active?: boolean, vrcOpen?: boolean) {
            
        this.connected = connected
        this.muted = muted
        this.isPancake = isPancake
        this.avatar = avatar
        this.afk = afk
        this.active = active
        this.vrcOpen = vrcOpen
    }

    reset() {
        this.afk = undefined
        this.active = undefined
        this.isPancake = undefined
        this.muted = undefined
        this.avatar = undefined
        this.vrcOpen = undefined
    }

    update(update: any) {
        if (update.status) {
            this.afk = update.status.afk
            this.active = update.status.active
            this.isPancake = update.status.isPancake
            this.muted = update.status.muted
            this.avatar = update.status.avatar
            this.vrcOpen = update.status.vrcOpen
            this.image = update.status.image
        } else {
            switch (update.name) {
                case 'afk':
                    this.afk = update.value
                    break;
                case 'active':
                    this.active = update.value
                    break;
                case 'isPancake':
                    this.isPancake = update.value
                    break;
                case 'muted':
                    this.muted = update.value
                    break;
                case 'avatar':
                    this.avatar = update.value
                    break;
                case 'image':
                    this.image = update.value
                    break;
                case 'connected':
                    if (!update.value) {
                        this.reset()
                    }
                    this.connected = update.value
                    break;
                case 'vrcOpen':
                    if (!update.value) {
                        this.reset()
                    }
                    this.vrcOpen = update.value
                    break;
                default:
                    return false
            }
        }
        return true
    }
}

export default Status