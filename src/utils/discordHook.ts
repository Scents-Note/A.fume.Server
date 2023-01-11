import properties from '@src/utils/properties';
import { Webhook } from 'discord-webhook-node';

interface DiscordManager {
    getReportReviewHook(): Webhook | undefined;
    getServerStatusHook(): Webhook | undefined;
}

class DiscordManagerImpl implements DiscordManager {
    getReportReviewHook(): Webhook | undefined {
        const hook = new Webhook(
            'https://discord.com/api/webhooks/957212284617375744/hQOZd1qGPnv35YuhCXTHJB9ZtlRifhigpjXup8nbYiivX3PkJVaNePH-IDnC9zDuC4Z0'
        );

        const IMAGE_URL = 'https://i.ibb.co/7CbpQyx/logo.png';
        hook.setUsername('시향노트 신고 알림봇');
        hook.setAvatar(IMAGE_URL);
        return hook;
    }

    getServerStatusHook(): Webhook | undefined {
        if (properties.DISCORD_URL_FOR_SERVER_STATUS) {
            const hook = new Webhook(properties.DISCORD_URL_FOR_SERVER_STATUS);

            hook.setUsername('센츠 노트 서버 모니터링');
            hook.setAvatar('https://i.ibb.co/7CbpQyx/logo.png');
            return hook;
        }
        return undefined;
    }
}

const discordManager: DiscordManager = new DiscordManagerImpl();

export { discordManager, DiscordManager };
