import { createClient, RedisClientType } from "redis"

export class PubSubManager {
    private client: RedisClientType
    private static instance: PubSubManager;
    private subscriptions: Map<string, string[]>;
    private constructor(){
        this.client = createClient();
        this.client.connect();
        this.subscriptions = new Map();
    }
    static getInstance() {
        if (!PubSubManager.instance) {
            PubSubManager.instance = new PubSubManager
            return PubSubManager.instance
        }
        return PubSubManager.instance

    }

    addUser(userId: string, stock: string) {
        if (!this.subscriptions.has(stock)) {
            this.subscriptions.set(stock, []);
        }
        this.subscriptions.get(stock)?.push(userId);
        
        if (this.subscriptions.get(stock)?.length === 1) {
            this.client.subscribe(stock, (message) => {
                this.handleMessage(stock, message);
            });
            console.log(`Subscribed to Redis channel: ${stock}`);
        }
    }

    removeUser(userId: string, stock: string) {
        this.subscriptions.set(stock, this.subscriptions.get(stock)?.filter((sub) => sub !== userId) || []);

        if (this.subscriptions.get(stock)?.length === 0) {
            this.client.unsubscribe(stock);
            console.log(`UnSubscribed to Redis channel: ${stock}`);
        }
    }
    
    private handleMessage(stock: string, message: string) {
        console.log(`Message received on channel ${stock}: ${message}`);
        this.subscriptions.get(stock)?.forEach((sub) => {
            console.log(`Sending message to user: ${sub}`);
        });
    }

    public async disconnect() {
        await this.client.quit();
    }
}