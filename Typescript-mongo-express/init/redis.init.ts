
import log from '../logger';
import {RedisClientType,createClient} from "redis";


export class RedisClient {
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({
        url: process.env.REDIS_URL,
    });
    this.client.connect();
    this.client.on('connect', () => {
        log.success('Connected to Redis');
    }
    );
    this.client.on('error', (error) => {
        log.error('Error connecting to Redis');
        log.trace(error);
    }
    );
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return value;
  }

  async set(key: string, value: any): Promise<void> {
    await this.client.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  get redisClient(): RedisClientType {
    return this.client;
  }
}

class Singleton extends RedisClient {
    private static instance: RedisClient;
    private constructor(){
        super();
    }
    public static getInstance(): Singleton{
        if(!Singleton.instance){
            Singleton.instance = new RedisClient();
        }
        return Singleton.instance;
    }
}

export const Redis:RedisClient = Singleton.getInstance();