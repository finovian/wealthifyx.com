##  Known Issues & Improvements

### Bug 1: Missing Input Assumptions

**Problem:**  
The agent proceeds with calculations by assuming missing required inputs (e.g., monthly expenses).

**Impact:**  
- Produces incorrect or misleading results  
- Breaks trust in financial outputs  

**Expected Behavior:**  
- Detect missing required inputs before calculation  
- Ask a single, clear follow-up question (e.g., "What are your monthly expenses?")  
- Do not proceed until all required inputs are available  

**Fix:**  
- Enforce strict input validation  
- Update system prompt to prohibit assumptions  
- Add pre-calculation checks in backend  


---

### Bug 2: Unrealistic Output Not Flagged

**Problem:**  
The agent returns impractical results (e.g., 372 years to reach a goal) without warning the user.

**Impact:**  
- Misleading financial planning  
- Poor user experience  

**Expected Behavior:**  
- Detect unrealistic outputs (e.g., time horizon > 50 years)  
- Flag results as impractical  
- Suggest corrective actions (increase contributions, adjust returns, revise goals)  

**Fix:**  
- Add post-calculation validation layer  
- Implement sanity checks on outputs  
- Return warnings alongside results  


---

### Bug 3: Underage User Handling

**Problem:**  
The agent treats users with age ≤ 18 the same as adults in financial planning scenarios.

**Impact:**  
- Unrealistic assumptions (income stability, investment access)  
- Contextually inappropriate recommendations  

**Expected Behavior:**  
- Detect underage users (age ≤ 18)  
- Adjust tone and recommendations  
- Provide context-aware guidance instead of direct actionable plans  
- Avoid presenting long-term projections as fully actionable  

**Fix:**  
- Add age-based validation rules  
- Introduce contextual response logic for minors  


---

### Bug 4: Blind Trust in LLM Output

**Problem:**  
The system directly uses LLM outputs (tool inputs, extracted data, responses) without validation.

**Impact:**  
- Invalid or malformed JSON  
- Hallucinated or incorrect financial data  
- Unsafe or misleading results  

**Expected Behavior:**  
- Validate all LLM outputs before usage  
- Apply schema validation and type checks  
- Enforce business rules
- Use deterministic logic for all critical calculations  

**Fix:**  
- Add JSON parsing safeguards  
- Implement schema validation 
- Introduce a validation layer before execution  