from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage, ToolMessage, SystemMessage
from langchain_ollama import ChatOllama
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from tools import tools


class AgentState(TypedDict):
    message: Annotated[Sequence[BaseMessage], add_messages]


model = ChatOllama(model="gpt-oss:120b-cloud").bind_tools(tools)