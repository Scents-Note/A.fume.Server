const { Webhook } = require('discord-webhook-node');

const hook = new Webhook("https://discord.com/api/webhooks/957212284617375744/hQOZd1qGPnv35YuhCXTHJB9ZtlRifhigpjXup8nbYiivX3PkJVaNePH-IDnC9zDuC4Z0");

const IMAGE_URL = 'https://i.ibb.co/7CbpQyx/logo.png';
hook.setUsername('시향노트 신고 알림봇');
hook.setAvatar(IMAGE_URL);

module.exports = hook;