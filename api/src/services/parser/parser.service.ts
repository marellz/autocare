// import { CarPartDetailEnum } from "../../db/models/request.model";
import OpenAI from "openai";
import { openAiClient } from "../../services/openAI/openAI.service";
import {
  CapturedDetails,
  CarPartDetail,
  CarPartDetailEnum,
} from "../../db/models/request.model";
import {
  VendorResponseEnum,
  VendorResponseKeys,
} from "../../db/models/vendorRequest.model";

type CarProperties = Record<
  CarPartDetail,
  {
    type: "string" | "number" | "boolean";
    description: string;
    nullable?: boolean;
  }
>;

export interface ParserResponse {
  capturedKeys: Partial<CapturedDetails>;
}

export interface CapturedResponseDetails {
  [VendorResponseEnum.AVAILABLE]?: boolean;
  [VendorResponseEnum.CONDITION]?: string | null;
  [VendorResponseEnum.PRICE]?: number | null;
  [VendorResponseEnum.NOTES]?: string | null;
}

const carProperties: CarProperties = {
  [CarPartDetailEnum.PART_NAME]: {
    type: "string",
    description: "The car part the user is looking for",
  },
  [CarPartDetailEnum.CAR_BRAND]: {
    type: "string",
    description: "The brand of the car (e.g. Toyota, Mazda)",
  },
  [CarPartDetailEnum.CAR_MODEL]: {
    type: "string",
    description: "The model of the car (e.g. Demio, Probox)",
  },
  [CarPartDetailEnum.CAR_YEAR]: {
    type: "string",
    description: "The year of the car (e.g. 2017)",
  },
  [CarPartDetailEnum.CAR_VARIANT]: {
    type: "string",
    description:
      "Variant of the car (e.g. diesel, petrol, hybrid). Only include if mentioned or needed to clarify an ambiguous model.",
    nullable: true,
  },
  [CarPartDetailEnum.ENGINE_SIZE]: {
    type: "string",
    description:
      "Engine size if mentioned (e.g. 1.5L). Optional — include only if user specified or needed for clarity.",
    nullable: true,
  },
  [CarPartDetailEnum.TRANSMISSION]: {
    type: "string",
    description:
      "Transmission type (e.g. automatic, manual). Optional — include only if mentioned.",
    nullable: true,
  },
  [CarPartDetailEnum.BODY_TYPE]: {
    type: "string",
    description: "Body type (e.g coupe, sedan, convertible)",
  },
};

export const requiredKeys: CarPartDetail[] = [
  CarPartDetailEnum.PART_NAME,
  CarPartDetailEnum.CAR_BRAND,
  CarPartDetailEnum.CAR_MODEL,
  CarPartDetailEnum.CAR_YEAR,
];

class ParserService {
  static async parse(
    input: string,
    properties: Partial<CarProperties> = carProperties,
  ) {
    const functions: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "extract_car_part_info",
          description:
            "Extracts car part and vehicle details from a user's message",
          parameters: {
            type: "object",
            properties,
            required: requiredKeys,
          },
        },
      },
    ];

    const response = await openAiClient.chat.completions.create({
      model: "gpt-4-1106-preview", // supports tool calling
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
      tools: functions,
      tool_choice: "auto",
    });
    const toolCall = response.choices[0].message.tool_calls?.[0];

    if (!toolCall) {
      return { capturedKeys: {}, missingKeys: requiredKeys } as ParserResponse;
    }
    const capturedKeys = JSON.parse(
      toolCall.function.arguments,
    ) as CapturedDetails;

    const _keys = Object.keys(capturedKeys) as CarPartDetail[];

    _keys.forEach((k) => {
      if (!capturedKeys[k]) delete capturedKeys[k];
    });

    return {
      capturedKeys,
    };
  }

  static async parseNewRequest(input: string) {
    return await this.parse(input);
  }

  static async parseMissingDetails(input: string, missing: CarPartDetail[]) {
    const missingProperties: Partial<CarProperties> = missing.reduce(
      (prev, curr) => ({ ...prev, [curr]: carProperties[curr] }),
      {},
    );
    return await this.parse(input, missingProperties);
  }

  static async parseVendorResponse(input: string) {
    // { availability, price }

    // todo: use separate parser for this
    const properties = {
      [VendorResponseEnum.AVAILABLE]: {
        type: "boolean",
        description:
          "Availability of the part (e.g. false if 'not available/does not have', true if available, already quoted price/condition)",
      },
      [VendorResponseEnum.CONDITION]: {
        type: "string",
        description: "Condition of the part (e.g. new, used, refurbished)",
      },
      [VendorResponseEnum.PRICE]: {
        type: "number",
        description: "Price of the part in KES(e.g 1500, 2,000, 15k)",
      },
    };

    const functions: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "extract_vendor_response",
          description:
            "Extracts car part and vehicle details from a user's message",
          parameters: {
            type: "object",
            properties,
            required: requiredKeys,
          },
        },
      },
    ];

    const response = await openAiClient.chat.completions.create({
      model: "gpt-4-1106-preview", // supports tool calling
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
      tools: functions,
      tool_choice: "auto",
    });
    const toolCall = response.choices[0].message.tool_calls?.[0];

    if (!toolCall) {
      return {
        availabile: false,
        condition: null,
        price: null,
      } as CapturedResponseDetails;
    }
    const capturedKeys = JSON.parse(
      toolCall.function.arguments,
    ) as CapturedResponseDetails;

    const _keys = Object.keys(capturedKeys) as VendorResponseKeys[];

    _keys.forEach((k) => {
      if (!capturedKeys[k]) delete capturedKeys[k];
    });

    return capturedKeys;
  }
}

export default ParserService;
