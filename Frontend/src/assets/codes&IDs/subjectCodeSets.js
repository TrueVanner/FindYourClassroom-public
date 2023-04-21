import IDs from './codesToIDs.json'

export const G1 = [
	IDs.ENG_A,
	IDs.POL_G1,
	IDs.POL_G2
]
export const G2 = [
	IDs.ENG_B_G1,
	IDs.ENG_B_G2,
	IDs.ENG_B_G3,
	IDs.ENG_B_G4,
	IDs.DEU,
	IDs.ESP,
	IDs.FRA
]
export const G3 = [
	IDs.BYS,
	IDs.PSY,
	IDs.HIST,
	IDs.GEO,
	IDs.ECON,
]
export const G4 = [
	IDs.PHYS,
	IDs.BIO,
	IDs.CHEM,
	IDs.COMP_SCI,
	IDs.SEH_SCI
]
export const G5 = [
	IDs.MATH_AA,
	IDs.MATH_AI
]
export const TOK = [
	IDs.TOK_MON,
	IDs.TOK_TUE,
	IDs.TOK_WED,
	IDs.TOK_THU,
	IDs.TOK_FRI
]
export const G6 = [
	IDs.ART,
	...G1,
	...G2,
	...G3,
	...G4,
	...G5
]