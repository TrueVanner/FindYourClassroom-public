// converts the timetable to JSON format

import fs from "fs"
import { Timetable_DP1, Timetable_DP2 } from "./timetable_base.js"

const TT_FULL = [Timetable_DP1, Timetable_DP2]

fs.writeFileSync("full.json", JSON.stringify(TT_FULL, undefined, 4))
