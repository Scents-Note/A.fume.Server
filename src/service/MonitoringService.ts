import { logger } from '@modules/winston';
import { discordManager } from '@src/utils/discordHook';
import properties from '@src/utils/properties';

const LOG_TAG: string = '[Monitoring/Service]';

const { Webhook } = require('discord-webhook-node');

function currentDateString() {
    return new Date().toLocaleString('ko-KR');
}

class MonitoringToken {
    startTime: string;
    numberOfHttpRequest: number;
    visitors: Set<number>;
    responseStatusCodeMap: Map<number, number>;
    constructor() {
        this.startTime = currentDateString();
        this.numberOfHttpRequest = 0;
        this.visitors = new Set<number>();
        this.responseStatusCodeMap = new Map<number, number>();
    }
    refresh() {
        this.startTime = currentDateString();
        this.numberOfHttpRequest = 0;
        this.visitors = new Set<number>();
        this.responseStatusCodeMap = new Map<number, number>();
    }
    static instance = new MonitoringToken();
}

class MonitoringService {
    hook: typeof Webhook | undefined;
    constructor() {
        this.hook = discordManager.getServiceMonitoringHook();
    }

    /**
     * 서버 상태 전송
     *
     **/
    sendServerStatusMessage() {
        logger.debug(`${LOG_TAG} sendServerStatusMessage`);
        if (!this.hook) {
            logger.debug(
                `${LOG_TAG} sendServerStatusMessage : hook is undefined`
            );
            return;
        }

        const token: MonitoringToken = MonitoringToken.instance;
        this.hook.send(
            [
                `▷▷▷▷▷\t\t서버 : ${properties.SERVER_NAME} \t\t◁◁◁◁◁`,
                `▷ ${properties.SERVER_IP}:${properties.PORT}`,
                `▷ profile : ${properties.NODE_ENV}`,
                `▷ date : ${token.startTime} ~ ${currentDateString()}`,
                `▷ info `,
                `▷▷ number of requests: ${token.numberOfHttpRequest}`,
                `▷▷ status code of responses: ${[
                    ...token.responseStatusCodeMap.entries(),
                ].map((it) => `${it[0]}:${it[1]}`)}`,
                `▷▷ number of visitors: ${token.visitors.size}`,
                `▷▷ visitors: ${[...token.visitors].join(',')}`,
                '----------------------------------------------------------',
            ].join('\n')
        );
        MonitoringToken.instance.refresh();
    }

    static getToken(): MonitoringToken {
        return MonitoringToken.instance;
    }
}

export default MonitoringService;
