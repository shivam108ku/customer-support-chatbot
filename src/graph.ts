import { StateGraph } from "@langchain/langgraph";
import { StateAnnotation } from "./state";
import { model } from "./model";

async function frontDeskSupport(state: typeof StateAnnotation.State) {
  const SYSTEM_PROMPT = `You are frontline support staff for RedHacker, an ed-tech company that helps software 
  developers excel in their careers through practical web development and Generative AI courses.
  Be concise in your responses.

 You can chat with students and help them with basic questions, but if the student is having a
 marketing or learning support query, do not try to answer the question directly or gather information.

Instead, immediately transfer them to the marketing team (promo codes, discounts, offers, and 
special campaigns) or learning support team (courses, syllabus coverage, learning paths, and 
study strategies) by asking the user to hold for a moment.
Otherwise, just respond conversationally.`;

  await model.invoke([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...state.messages,
  ]);

  return state;
}

function marketingSupport(state: typeof StateAnnotation.State) {
  return state;
}

function learningSupport(state: typeof StateAnnotation.State) {
  return state;
}

const graph = new StateGraph(StateAnnotation)
  .addNode("frontDeskSupport", frontDeskSupport)
  .addNode("marketingSupport", marketingSupport)
  .addNode("learningSupport", learningSupport)
  .addEdge("__start__", "frontDeskSupport");
// .addEdge('__start__', 'frontDeskSupport');
