from langchain_core.tools import tool

URL = "127.0.0.1/api"

@tool
def browse_menu():
    return


@tool
def place_order():
    return


@tool
def track_order():
    return

tools = [browse_menu, place_order, track_order]