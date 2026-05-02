import { END, StateGraph } from "@langchain/langgraph";
import { StateAnnotation } from "./state";
import { model } from "./model";
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { getOffers } from "./tools";

const marketingTools = [getOffers]

async function frontDeskSupport(state: typeof StateAnnotation.State) {
  const SYSTEM_PROMPT = `You are frontline support staff for RedHacker, an ed-tech company that helps software 
developers excel in their careers through practical web development and Generative AI courses.
Be concise in your responses.

You can chat with students and help them with basic questions like greetings or general company info.

However, if the student asks ANYTHING related to:
- Course recommendations or which course to take
- Their learning path or roadmap
- Syllabus or course content details
- Study strategies or schedules
- Skill level assessments

You MUST NOT answer these directly. Instead, say: 
"Great question! Let me connect you with our learning support team. Please hold for a moment."

If the student asks ANYTHING related to:
- Promo codes, discounts, or offers
- Pricing or special campaigns

You MUST NOT answer these directly. Instead, say:
"Sure! Let me connect you with our marketing team. Please hold for a moment."

For everything else, respond conversationally.`;

  const supportResponse = await model.invoke([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...state.messages,
  ]);

  const CATEGORIZATION_SYSTEM_PROMPT = `You are an expert customer support agent routing system.
  Your job is to detect whether a customer respresentative is routing a user to a marketing team 
  or learning support team, or if they are just responding conversationally`;

  const CATEGORIZATION_HUMAN_PROMPT = `Based on the user's message below, decide where to route them.

User message: "${(state.messages[state.messages.length - 1] as any).content}"

Respond with a JSON object with key "nextRepresentative":
- "MARKETING" if they ask about discounts, promo codes, offers, or pricing
- "LEARNING" if they ask about courses, recommendations, roadmaps, syllabus, or study paths
- "RESPOND" if it's just a greeting or general question`;

  const categorizationResponse = await model.invoke(
    [
      {
        role: "system",
        content: CATEGORIZATION_SYSTEM_PROMPT,
      },
      ...state.messages,
      supportResponse,
      {
        role: "user",
        content: CATEGORIZATION_HUMAN_PROMPT,
      },
    ],
    {
      response_format: {
        type: "json_object",
      },
    },
  );

  const categorizationOutput = JSON.parse(
    categorizationResponse.content as string,
  );

  return {
    messages: [supportResponse],
    nextRepresentative: categorizationOutput.nextRepresentative,
  };
}

function marketingSupport(state: typeof StateAnnotation.State) {
  console.log("By marketing");
  return state;
}

function learningSupport(state: typeof StateAnnotation.State) {
  console.log("By learning");
  return state;
}

function whoIsNext(state: typeof StateAnnotation.State) {
  if (state.nextRepresentative.includes("MARKETING")) {
    return "marketingSupport";
  } else if (state.nextRepresentative.includes("LEARNING")) {
    return "learningSupport";
  } else if (state.nextRepresentative.includes("RESPOND")) {
    return END;
  } else {
    return END;
  }
}

const graph = new StateGraph(StateAnnotation)
  .addNode("frontDeskSupport", frontDeskSupport)
  .addNode("marketingSupport", marketingSupport)

  .addNode("learningSupport", learningSupport)
  .addEdge("__start__", "frontDeskSupport")
  .addEdge("marketingSupport", "__end__")
  .addEdge("learningSupport", "__end__")
  .addConditionalEdges("frontDeskSupport", whoIsNext, {
    marketingSupport: "marketingSupport",
    learningSupport: "learningSupport",
    __end__: END,
  });

const app = graph.compile();

async function main() {
  const stream = await app.stream({
    messages: [
      {
        role: "user",
        content: "Do you have any coupon code for the courses",
      },
    ],
  });
  for await (const value of stream) {
    console.log("---step---");
    console.log(value);
    console.log("---step---");
  }
}
main();


