import SearchHistoryService from '@src/service/SearchHistoryService';
import cron from 'node-cron';
import { logger } from '@modules/winston';
import properties from '@src/utils/properties';
import MonitoringService from '@src/service/MonitoringService';
import { PerfumeSearchRefreshService } from '@src/service/PerfumeSearchRefreshService';

const TAG = '[Scheduler]';
const searchHistoryService = new SearchHistoryService();
const monitoringService: MonitoringService = new MonitoringService();

function reloadSearchHistory() {
    return searchHistoryService.reloadSearchHistory();
}

function sendServerStatusMessage() {
    return monitoringService.sendServerStatusMessage();
}

const debug: boolean = false;

class SchedulerManager {
    tasks = [
        cron.schedule('0 0 4 * * *', (now) => {
            logger.debug(
                TAG,
                `execute reloadSearchHistory() by schedule [0 0 4 * * *] at ${now}`
            );
            reloadSearchHistory();
        }),
        cron.schedule('0 0 */2 * * *', (now) => {
            logger.debug(
                TAG,
                `execute sendServerStatusMessage() by schedule [0 0 */2 * * *] at ${now}`
            );
            sendServerStatusMessage();
        }),
        cron.schedule('0 0 4 * * *', (now) => {
            logger.debug(
                TAG,
                `execute migratePerfumes() by schedule [0 0 16 * * *] at ${now}`
            );
            new PerfumeSearchRefreshService().migratePerfumes();
        }),
    ];
    constructor() {
        if (debug) {
            logger.debug(TAG, `execute reloadSearchHistory() by debug flag`);
            reloadSearchHistory();
            return;
        }
    }

    start() {
        if (properties.NODE_ENV != 'production' && !debug) {
            return;
        }
        this.tasks.forEach((it) => it.start());
    }

    stop() {
        this.tasks.forEach((it) => it.stop());
    }
}

export default SchedulerManager;
