import { styled, TextField } from '@mui/material'
import BG from './BG'
import RGB_HEX from './RGB_HEX'

BG.genBG()

export default styled(TextField)`
  background-color: ${RGB_HEX.rgbToHex(RGB_HEX.changeRGB(BG.rgb, 25))};
  width: 35ch;
`