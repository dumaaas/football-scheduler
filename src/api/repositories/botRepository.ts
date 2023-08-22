export class BotRepository {
  async sendMessage(message: string, shouldPin: boolean) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot6569559665:AAGKCFYiUHWMOLt-qjkUrbwiKjXDQiUJyl4/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: "-913133564",
            text: message,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
        }
      );

      const data = await response.json();

      if (data.ok && shouldPin) {
        const messageId = data.result.message_id;

        await fetch(
          `https://api.telegram.org/bot6569559665:AAGKCFYiUHWMOLt-qjkUrbwiKjXDQiUJyl4/pinChatMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: "-913133564",
              message_id: messageId,
            }),
          }
        );
      }
    } catch (error) {
      console.error("Greška prilikom slanja zahteva:", error);
    }
  }
}

export const BotKeys = {
  GAME: "GAME",
  GAMES: "GAMES",
  ACTIVE_GAMES: "ACTIVE_GAMES",
};
