import {http} from "justom-share";
import env from "@share/env"

const httpInstance = http.create(env.host);

export default httpInstance