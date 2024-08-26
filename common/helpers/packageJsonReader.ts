import fs from "node:fs";

/**
 * Reads `package.json` (all or a single property)
 * 
 * Uses **sync** file system call
 */
export default function packageJsonReader(path: string): unknown | null;
export default function packageJsonReader(path: string, key: string): string;
export default function packageJsonReader(path: string, key?: string): string | unknown | null {
    try {
        const obj = JSON.parse((fs.readFileSync(path)).toString());
        if (key)
            return obj[key] as string;
        return obj;
    } catch {
        return key ? `unknown ${key}` : null;
    }
}