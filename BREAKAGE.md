Bug 1: Agent assumes monthly expenses when not provided.
Should ask: "What are your monthly expenses?" before calculating.
Fix: Tighten system prompt — never assume missing required inputs.

Bug 2: Agent presents unrealistic results (372 years) without 
flagging them as problematic.
Should detect: if result > 50 years, warn user and suggest 
increasing contributions.