from core.state_compression import compress_sensor_data

class OrchestratorAgent:
    def __init__(self):
        self.state_memory = {}

    def process(self, raw_sensor_data: dict) -> dict:
        state = compress_sensor_data(raw_sensor_data)
        room = state["room"]

        # First time seeing this room — always process it
        is_new = room not in self.state_memory
        self.state_memory[room] = state
        actions = self._coordinate_agents(state)

        return {"action": actions, "state": state}

    def _coordinate_agents(self, state: dict) -> dict:
        actions = {}

        # Lighting
        if state["occupied"]:
            if state["light_state"] == "Dark":
                actions["lighting"] = "turn_on"
            elif state["light_state"] == "Moderate":
                actions["lighting"] = "dim"
            else:
                actions["lighting"] = "turn_off"
        else:
            actions["lighting"] = "turn_off"

        # Climate
        if state["occupied"]:
            if state["temp_state"] == "High":
                actions["ac"] = "cool"
            elif state["temp_state"] == "Low":
                actions["ac"] = "heat"
            else:
                actions["ac"] = "maintain"
        else:
            actions["ac"] = "standby"

        # Air quality
        if state["air_quality"] == "Poor":
            actions["ventilation"] = "turn_on"
        else:
            actions["ventilation"] = "turn_off"

        # Security
        if state["time"] == "Night":
            if state["occupied"]:
                actions["security"] = "home_mode"
            else:
                actions["security"] = "monitor"
        else:
            actions["security"] = "day_mode"

        # Energy
        if not state["occupied"]:
            actions["energy"] = "saving_mode"
        else:
            actions["energy"] = "normal_mode"

        return actions

orchestrator = OrchestratorAgent()