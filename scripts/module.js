Hooks.once('init', async function() {
    game.settings.register("depruner-chat-message-remover", "limit", {
        name: game.i18n.localize("depruner-chat-message-remover.module-settings.limit.name"),
        hint: game.i18n.localize("depruner-chat-message-remover.module-settings.limit.hint"),
        scope: "world",
        config: true,
        default: 30,
        type: Number,
    });
	game.settings.register("depruner-chat-message-remover", "threshold", {
        name: game.i18n.localize("depruner-chat-message-remover.module-settings.threshold.name"),
        hint: game.i18n.localize("depruner-chat-message-remover.module-settings.threshold.hint"),
        scope: "world",
        config: true,
        default: 40,
        type: Number,
    });
});

var currentlyDeleting = false;

Hooks.once('ready', async function() {
    if (!game.user.isGM) return;
    Hooks.on('createChatMessage', async (_document, _options, _userId) => {
        if (currentlyDeleting)
            return;
        const maxMessages = game.settings.get("depruner-chat-message-remover", "limit");
        const threshold = game.settings.get("depruner-chat-message-remover", "threshold");
        if (maxMessages > threshold)
            ui.notifications.warn("Message limit higher than threshold!");
        const messages = game.messages.contents;
        if (messages.length < threshold)
            return;
        const messagesToDelete = messages.length - Math.min(maxMessages, threshold);
        if (messagesToDelete <= 0) return;
        let messagesId = messages.slice(0, messagesToDelete).map(m => m.id);
        currentlyDeleting = true;
        await ChatMessage.deleteDocuments(messagesId);
        currentlyDeleting = false;
    });
});
