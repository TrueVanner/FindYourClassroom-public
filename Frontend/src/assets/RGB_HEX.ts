import { rgb } from './BG'

class RGB_HEX {
	static validateRGB(rgb: rgb) {
		Object.keys(rgb).forEach(key => {
			if(rgb[key as keyof rgb] > 255) rgb[key as keyof rgb] = 255
		})
		return rgb
	}

	static rgbToHex(rgb: rgb) {
		return '#' + rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16)
	}

	static changeRGB(rgb: rgb, value: number) {
		return RGB_HEX.validateRGB({ r: rgb.r + value, g: rgb.g + value, b: rgb.b + value })
	}
}

export default RGB_HEX