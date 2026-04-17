import { MoneybagSdk, PAYMENT_STATUS, PAYMENT_METHODS, CURRENCY_CODES } from "@moneybag/sdk";
import environment from "../config/environment.js";

function getEnvOrThrow(key: keyof typeof environment): string {
    const value = environment[key];
    if (!value) throw new Error(`Missing env: ${key}`);
    return value as string;
}

export const moneybag = new MoneybagSdk({
    apiKey: getEnvOrThrow("moneybagApiKey"),
    baseUrl: getEnvOrThrow("moneybagBaseUrl"),
    timeout: 30000,
    retryAttempts: 3,
});

export { PAYMENT_STATUS, PAYMENT_METHODS, CURRENCY_CODES };

export type { 
    CheckoutRequest as MoneybagCheckoutPayload, 
    CheckoutResponse as MoneybagCheckoutResponse,
    VerifyResponse as MoneybagVerifyResponse 
} from "@moneybag/sdk";
