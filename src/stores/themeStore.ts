import { defineStore } from 'pinia'

// This function shamelessly copied from the internet
function hexToCssHsl(hex: string) {

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result == null)
        throw new Error(`Failed to parse ${hex} to HSL`)

    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)

    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h
    let s
    const l = (max + min) / 2

    if (max == min) {
        h = s = 0 // achromatic
    } else {

        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch(max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
            default:
                throw new Error('Impossible max color')
        }

        h /= 6
    }

    return [h, s, l]
}

function toLightHslCss(hsl: Array<number>) {

    const h = Math.round(hsl[0] * 360)
    const s = Math.round(hsl[1] * 100)

    let l = Math.round((hsl[2] + 30) * 100)
    if (l > 100) {
        l = 100
    }

    return `hsl(${h},${s}%,${l}%)`
}

export const useThemeStore = defineStore('theme', {
  state: () => {
    return { colorPrimary: '', textPrimary: '', boxShadow: '', lightHslCss: '' }
  },
  actions: {
    setColorPrimary(colorPrimary: string) {

      this.lightHslCss = toLightHslCss(hexToCssHsl(colorPrimary))
      this.colorPrimary = '#' + colorPrimary

      this.textPrimary = 'color: ' + this.colorPrimary + ' !important'

      this.boxShadow = '0 0 0 1px #fff, 0 0 0 0.25rem ' + this.colorPrimary + '40'
    }
  }
})
