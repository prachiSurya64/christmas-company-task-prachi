# PROMPTS — AI-Assisted Coding Notes

This project used ChatGPT for architectural guidance, functionalities.  
Below is a professional summary of the prompts/conversations that influenced the final solution.

---

1. Initial Concept
I asked AI assistance on how to build a "drawing board application" similar to online canvas tools, using only "frontend technology".
  
The goal was:
- Implement drawing tools (brush, line, shapes, text)
- Maintain state without a backend
- Build a share feature that allows someone else to open the same drawing state

---

2. Problem Consideration: Sharing Without Backend
I asked how sharing can work "without a server", where:
- LocalStorage is user-specific
- Sharing LocalStorage data between users is not possible

AI recommended using:
- "URL-based scene sharing"
- With scene data "compressed" using LZ-String
- So a friend can open the exact same state even without a backend

-------
- I cannot use a backend or database(I am not using a backend because of limited time and other ongoing workload commitments)
- Everything must run purely in the browser

AI helped design a solution:
- Save drawing locally via localStorage
- For sharing, compress the scene to query params
- On page load, the app reads and restores the scene

---

4. Collaboration Scenario
I had another design question:

> If I draw something → share URL → close my tab → my friend draws more →  
> How can the updated state be preserved without server sync?

AI explained:
- This is not real-time collaboration (no backend)
- Each URL contains only the state at the moment of sharing
- If the friend modifies it, they must share back a "new URL" with updated compressed data

This clarified the limitation of a backend-less system.


