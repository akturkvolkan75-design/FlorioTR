declare module "iyzipay" {
  type Callback = (error: Error | null, result: Record<string, unknown>) => void;
  class Iyzipay {
    constructor(config?: { apiKey?: string; secretKey?: string; uri?: string });
    checkoutFormInitialize: { create(request: Record<string, unknown>, callback: Callback): void };
    checkoutForm: { retrieve(request: Record<string, unknown>, callback: Callback): void };
    static LOCALE: { TR: string };
    static CURRENCY: { TRY: string };
    static PAYMENT_GROUP: { PRODUCT: string };
    static BASKET_ITEM_TYPE: { PHYSICAL: string };
  }
  export default Iyzipay;
}
