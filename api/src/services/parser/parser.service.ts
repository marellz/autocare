import { openAiClient } from "#services/openAI/openAI.service.js";

class ParserService {
  static async parse(input, { description, keys }) {
    try {
      const _input = `
            Input: "${input}"

            Context: ${description}

            Expected Output:
            - Return a JSON object with "missingKeys" property(array) and/or "capturedKeys" prop(object):
            - for capturedKeys, I would need a object with the keys ${keys.join(', ')} mapped to the values extracted
            - If some keys are missing, respond with: { "missingKeys": [...], "capturedKeys": { ... } }
            - If all keys are missing or the message is too vague, respond with: { "message": "Unable to decode your message" }

            IMPORTANT: Do not wrap your response in backticks or say anything else. Respond with plain JSON only.
        `;

      const _prompt = {
        role: "user",
        content: _input,
      };

      const _instruction = {
        role: "system",
        content:
          "You are a helpful assistant that extracts structured data from messages and returns clean, valid JSON. Do not add extra text or formatting.",
      };
      const response = await openAiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [_instruction, _prompt],
      });

      const { choices } = response;
      if (!choices.length) return { error: "No content returned" };
      const { content: _rawContent } = choices[0].message;

      const content = JSON.parse(_rawContent);

      return content;

      //   return {};
    } catch (error) {
      console.log({ error: "Error getting openAI request", message: error });
    }
  }

  static async parseNewRequest(input) {
    const response = await this.parse(input, {
      description:
        "This is input from a new user looking for a particular part for their car.",
      keys: [
        "carPartName(string)",
        "carBrandAndModel(string)",
        "carYearOrGeneration(string)",
      ],
    });
    console.log({response})
    
    return response;
}

static async parseMissingDetails(input, keys = [], context){
    const response = await this.parse(input, {
        description: `This is input from a user that has a current request but their original message was missing the following: ${keys.join(', ')}. Their original item message is ${context}`,
        keys
    }) 
    
    console.log({response})
    return response
}

static async parseVendorResponse(input) {
    // { availability, price }
    const response = await this.parse(input, {
        description:
        "This is a response from a vendor about a car part that was requested by a client.",
        keys: [
            "availability(boolean)",
            "price(string),",
            "condition: 'new' or 'used' or 'ex-japan/uk' ",
        ],
    });
    
    console.log({response})
    return response;
  }

  static async parseResponse() {}
}

export default ParserService;
