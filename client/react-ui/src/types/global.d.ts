/* eslint-disable @typescript-eslint/no-unused-vars */

import type { ElectronAPI } from "@/common/types/ComInterface";

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }

    interface String {
        /**
         * String format using an input (number, string or an array of numbers and strings).
         * 
         * Example: 'Hello %s1!'.format(['world']) -> 'Hello world!'
         */
        format(replaceWith: number | string | Array<number | string>): string;
    }
}
