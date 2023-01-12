import { logger } from '@modules/winston';
import { discordManager } from '@src/utils/discordHook';
import properties from '@src/utils/properties';

const LOG_TAG: string = '[Monitoring/Service]';

const { Webhook } = require('discord-webhook-node');

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

        this.hook.send(
            [
                `서버 : ${properties.SERVER_NAME}`,
                `ip : ${properties.SERVER_IP}`,
                `port : ${properties.PORT}`,
                `profile : ${properties.NODE_ENV}`,
                `date : ${new Date()}`,
            ].join('\n')
        );
    }
}

export default MonitoringService;
