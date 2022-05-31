import io from "socket.io-client";
import { backendUrl } from "../utils/backendApi";


export const socket = io.connect(backendUrl);