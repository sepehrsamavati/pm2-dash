
import type { ElectronAPI } from "../../../common/types/ComInterface";

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
