import { gameManager} from "./store";

export function startLogger() {
    setInterval(() => {
        gameManager.logState();
    }, 4000)
}
