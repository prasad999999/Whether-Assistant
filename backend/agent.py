from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from tools import get_weather
from config import OPENROUTER_API_KEY



llm = ChatOpenAI(
    openai_api_base="https://openrouter.ai/api/v1",
    openai_api_key=OPENROUTER_API_KEY,
    model="mistralai/mistral-7b-instruct",
    temperature=0,
)


tools = [get_weather]


agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    handle_parsing_errors=True,
    agent_kwargs={
        "prefix": """
You are a weather assistant.

STRICT RULES FOR TOOL USAGE:

1. You MUST use the get_weather tool if the user asks about:
   - current weather
   - today / now / currently
   - conditions like cold, hot, raining, windy, sunny
   - temperature of a specific city

2. You MUST NOT use the tool for:
   - general climate questions
   - conceptual or theoretical questions (AQI, climate theory)
   - historical explanations

3. If the get_weather tool returns an error or indicates data is unavailable:
   - DO NOT retry the tool
   - DO NOT attempt another Action
   - IMMEDIATELY respond with:
     Final Answer: <polite explanation that data is unavailable>

4. You are allowed to use ONLY ONE tool:
   - get_weather
   NEVER invent new Action names.

5. If NO tool is required, respond ONLY with:
   Final Answer: <your answer>

6. NEVER output:
   - Action: None
   - Action: Answer
   - Free text without "Final Answer:"
"""
    },
)


def run_agent(user_message: str) -> str:
    """
    Runs the LangChain agent safely and returns final output text.
    """
    return agent.run(user_message)
