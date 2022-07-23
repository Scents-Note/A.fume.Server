import SearchHistoryService from '@src/service/SearchHistoryService';
import cron from 'node-cron';
import { logger } from '@modules/winston';
import properties from '@src/utils/properties';

const TAG = '[Scheduler]';
const searchHistoryService = new SearchHistoryService();

function reloadSearchHistory() {
    return searchHistoryService.reloadSearchHistory();
}

const debug: boolean = true;

class SchedulerManager {
    tasks = [
        cron.schedule('0 0 4 * * *', (now: Date) => {
            logger.debug(
                TAG,
                `execute reloadSearchHistory() by schedule [0 0 4 * * *] at ${now}`
            );
            reloadSearchHistory();
        }),
    ];
    constructor() {
        console.log('ScheduleManager');
        console.log(debug);
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
