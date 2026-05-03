import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../proto/definitions/rpc.proto');

export class SnapchainClient {
    private client: any;

    constructor(host = 'localhost:3382') {
        const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            includeDirs: [path.resolve(__dirname, '../proto/definitions')]
        });

        const hubProto = (grpc.loadPackageDefinition(packageDefinition) as any).HubService;
        this.client = new hubProto(host, grpc.credentials.createInsecure());
    }

    public async getInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.GetInfo({}, (err: any, response: any) => {
                if (err) reject(err);
                else resolve(response);
            });
        });
    }

    public subscribe(eventTypes: string[] = []): grpc.ClientReadableStream<any> {
        return this.client.Subscribe({ event_types: eventTypes });
    }

    public async getCastsByFid(fid: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.client.GetCastsByFid({ fid }, (err: any, response: any) => {
                if (err) reject(err);
                else resolve(response);
            });
        });
    }
}

export const snapchain = new SnapchainClient(process.env.SNAPCHAIN_HOST || 'localhost:3382');
