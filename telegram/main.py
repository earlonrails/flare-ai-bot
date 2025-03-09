import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,           # Log INFO and above (INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

TOKEN = os.getenv("TELEGRAM_TOKEN")
AI_API_URL = os.getenv("AI_API_URL")
BLOCKCHAIN_API_URL = os.getenv("BLOCKCHAIN_API_URL")
CANNED_RESPONSES = {
    "oops": "Oops! I am not sure how to help you with that."
}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Handle the /start command by sending a welcome message.

    Parameters:
        update (telegram.Update): The incoming update from Telegram.
        context (telegram.ext.ContextTypes.DEFAULT_TYPE): The context for handling the update.

    Returns:
        None
    """
    logger.info(f"Received /start command from user {update.effective_user.id}")
    await update.message.reply_text("Welcome to KineticGuardian! Say things like 'Borrow 50 FUSD'.")
    logger.info("Sent welcome message")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Handle incoming text messages, process them via AI and blockchain APIs, and respond.

    Parameters:
        update (telegram.Update): The incoming update from Telegram.
        context (telegram.ext.ContextTypes.DEFAULT_TYPE): The context for handling the update.

    Returns:
        None
    """
    command = update.message.text
    user_id = update.effective_user.id
    logger.info(f"Received message from user {user_id}: '{command}'")

    # Call AI to parse command
    try:
        logger.debug(f"Sending command to AI API: {command}")
        ai_response = requests.post(AI_API_URL, json={"command": command}).json()
        logger.info(f"AI API response: {ai_response}")
    except requests.RequestException as e:
        logger.error(f"AI API call failed: {str(e)}")
        await update.message.reply_text("Error contacting AI service")
        return

    await update.message.reply_text(ai_response.get("result", CANNED_RESPONSES.get("oops")))
    logger.info(f"Sent response to user {user_id}: '{ai_response}'")

if __name__ == "__main__":
    logger.info("Starting KineticGuardian Telegram bot")
    if not TOKEN or not AI_API_URL or not BLOCKCHAIN_API_URL:
        logger.critical("Missing environment variables (TOKEN, AI_API_URL, or BLOCKCHAIN_API_URL)")
        raise ValueError("Required environment variables are not set")

    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    logger.info("Bot handlers registered, starting polling")
    app.run_polling()
    logger.info("Bot polling stopped")
