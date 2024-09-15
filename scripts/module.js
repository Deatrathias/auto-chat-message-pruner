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
    Hooks.on('preCreateChatMessage', async (_document, _data, _options, userId) => {
        if (game.user.id !== userid) return;
        const maxMessages = game.settings.get("depruner-chat-message-remover", "limit");
        const messages = game.messages.contents;

        if (messages.length >= maxMessages) {
            const oldestMessage = messages[0];
            await oldestMessage.delete();
        }
    });
});
