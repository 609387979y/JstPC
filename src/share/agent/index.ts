
import { ElectronAgent } from "./types"
export * from './types';
import env from "@share/env"

/**
 * 获得electron agent
 * @returns 
 */
export function getElectronAgent(): ElectronAgent | null {
    if(window.electron_agent === undefined){
        return null
    }

    return window.electron_agent as ElectronAgent
}