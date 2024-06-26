import { PubSubManager } from "./PubSubManager";

setInterval(() => {
    PubSubManager.getInstance().addUser(Math.random().toString(), "APPL");
}, 5000)
