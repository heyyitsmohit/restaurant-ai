from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage, ToolMessage, SystemMessage
from langchain_ollama import ChatOllama
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from sqlalchemy.orm import Session
from agent.tools import make_tools



class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

_sessions = {} 


def run_agent(db: Session, message: str, session_id: str) -> str:
    tools = make_tools(db)
    model = ChatOllama(model="gpt-oss:120b-cloud").bind_tools(tools)
    
    history = _sessions.get(session_id, [])
    history.append(HumanMessage(content=message))

    def our_agent(state: AgentState) -> AgentState:
        system_prompt = SystemMessage(content="""
        You are Bistro's AI assistant. You help users:
        - Browse the menu
        - Place orders  
        - Track existing orders
        Always be helpful and concise.
        """)

        response = model.invoke([system_prompt] + list(state["messages"]))

        return {"messages": [response]}

    def should_continue(state: AgentState):
        last = state["messages"][-1]
        if not last.tool_calls:
            return "end"
        else:
            return "continue"

    graph = StateGraph(AgentState)

    graph.add_node("agent", our_agent)
    graph.add_node("tools", ToolNode(tools))

    graph.set_entry_point("agent")

    graph.add_edge("agent", "tools")

    graph.add_conditional_edges(
        "agent",
        should_continue,
        {
            "continue": "agent",
            "end": END,
        }
    )

    app = graph.compile()

    reply = app.invoke({"messages": history})

    _sessions[session_id] = list(reply["messages"])

    for msg in reversed(list(reply["messages"])):
        if isinstance(msg, AIMessage) and msg.content:
            return msg.content
        
    return ""