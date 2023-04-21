import RGB_HEX from './RGB_HEX'

export type rgb = {r: number, g: number, b: number}

class BG {
	static rgb: rgb
	static hex: string

	static genBG() {
		const rgb = { r: 0, g: 0, b: 0 }
		do {
			Object.keys(rgb).forEach(key => {
				rgb[key as keyof rgb] = parseInt((200 + Math.random()*55).toFixed(0))
			})
		}
		while (
			Math.abs(rgb.r - rgb.g) + Math.abs(rgb.g - rgb.b) + Math.abs(rgb.r - rgb.b) < 45 // check if the colors aren't simmilar to avoid gray colors (the difference between each two must be over 15)
		)
		BG.rgb = rgb
		BG.hex = RGB_HEX.rgbToHex(rgb)
	}
}

export default BG