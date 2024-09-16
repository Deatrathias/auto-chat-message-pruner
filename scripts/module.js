Hooks.once('init', async function () {
    game.settings.register("depruner-chat-message-remover", "limit", {
        name: game.i18n.localize("depruner-chat-message-remover.module-settings.limit.name"),
        hint: game.i18n.localize("depruner-chat-message-remover.module-settings.limit.hint"),
        scope: "world",
        config: true,
        default: 30,
        type: Number,
    });
});

Hooks.once('ready', async function () {
    if (!game.user.isGM) return;
    Hooks.on('preCreateChatMessage', async (_document, _data, _options, userId) => {
        const maxMessages = game.settings.get("depruner-chat-message-remover", "limit");
        const messages = game.messages.contents;
        const messagesToDelete = messages.length - maxMessages;
        if (messagesToDelete <= 0) return;
        for (let i = 0; i < messagesToDelete; i++) {
            const oldestMessage = messages[i];
            await oldestMessage.delete();
        }
    });
});
