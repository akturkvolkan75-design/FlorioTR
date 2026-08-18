import crypto from "crypto";

type IyzicoResponse = Record<string, unknown>;

function getConfig() {
  const apiKey = process.env.IYZIPAY_API_KEY;
  const secretKey = process.env.IYZIPAY_SECRET_KEY;
  const baseUrl =
    process.env.IYZIPAY_URI || "https://sandbox-api.iyzipay.com";

  if (!apiKey || !secretKey) {
    throw new Error("IYZICO_CONFIG_MISSING");
  }

  return {
    apiKey,
    secretKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
  };
}

function buildAuthorization(
  path: string,
  body: string,
  apiKey: string,
  secretKey: string,
) {
  const randomKey = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(randomKey + path + body, "utf8")
    .digest("hex");

  const authorizationString =
    `apiKey:${apiKey}` +
    `&randomKey:${randomKey}` +
    `&signature:${signature}`;

  const encoded = Buffer.from(
    authorizationString,
    "utf8",
  ).toString("base64");

  return {
    authorization: `IYZWSv2 ${encoded}`,
    randomKey,
  };
}

async function iyzicoPost(
  path: string,
  payload: Record<string, unknown>,
): Promise<IyzicoResponse> {
  const { apiKey, secretKey, baseUrl } = getConfig();

  const body = JSON.stringify(payload);

  const { authorization, randomKey } = buildAuthorization(
    path,
    body,
    apiKey,
    secretKey,
  );

  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
      "x-iyzi-rnd": randomKey,
    },
    body,
    cache: "no-store",
  });

  const text = await response.text();

  let data: IyzicoResponse;

  try {
    data = JSON.parse(text) as IyzicoResponse;
  } catch {
    throw new Error(
      `IYZICO_INVALID_RESPONSE:${response.status}:${text.slice(0, 200)}`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `IYZICO_HTTP_${response.status}:${String(
        data.errorMessage || "Iyzico isteği başarısız.",
      )}`,
    );
  }

  return data;
}

export function initializeCheckoutForm(
  payload: Record<string, unknown>,
) {
  return iyzicoPost(
    "/payment/iyzipos/checkoutform/initialize/auth/ecom",
    payload,
  );
}

export function retrieveCheckoutForm(token: string) {
  return iyzicoPost(
    "/payment/iyzipos/checkoutform/auth/ecom/detail",
    {
      locale: "tr",
      token,
    },
  );
}