import dotenv from 'dotenv';

dotenv.config();

export const config = {
  requestDelayMs: Number(process.env.REQUEST_DELAY || 1000),
  maxLotPagesToScan: Number(process.env.MAX_LOTS_PAGES_TO_SCAN || 5),
  checkInquiryIntervalMs: Number(process.env.CHECK_INQUIRY_INTERVAL || 60000),
  inquiryMinTtlMs: Number(process.env.INQUIRY_TTL || 3600000),
  proxyUri: process.env.PROXY_URI,
  telegramToken: process.env.TELEGRAM_TOKEN || '',
};
