import properties from '@src/utils/properties';
import { Webhook } from 'discord-webhook-node';

interface DiscordManager {
    getReportReviewHook(): Webhook | undefined;
    getServiceMonitoringHook(): Webhook | undefined;
}

class DiscordManagerImpl implements DiscordManager {
    getReportReviewHook(): Webhook | undefined {
        if (properties.DISCORD_HOOK_FOR_REPORT_REVIEW) {
            const hook = new Webhook(properties.DISCORD_HOOK_FOR_REPORT_REVIEW);

            const IMAGE_URL = 'https://i.ibb.co/7CbpQyx/logo.png';
            hook.setUsername('시향노트 신고 알림봇');
            hook.setAvatar(IMAGE_URL);
            return hook;
        }
        return undefined;
    }

    getServiceMonitoringHook(): Webhook | undefined {
        if (properties.DISCORD_HOOK_FOR_SERVICE_MONITORING) {
            const hook = new Webhook(
                properties.DISCORD_HOOK_FOR_SERVICE_MONITORING
            );

            hook.setUsername('센츠 노트 서버 모니터링');
            hook.setAvatar('https://i.ibb.co/7CbpQyx/logo.png');
            return hook;
        }
        return undefined;
    }
}

const discordManager: DiscordManager = new DiscordManagerImpl();

export { discordManager, DiscordManager };
