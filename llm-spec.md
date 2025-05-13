# Reality Show Simulator – Design Specification (v0.1)

## Overview

**Objective**: Build a PC‑first game that simulates social‑deduction reality TV shows (e.g., *Traitors*, *Survivor*). AI‑controlled contestants provide a rich single‑player experience and fill any empty slots in multiplayer.

**Status**: Solo‑developer prototype.

## High‑Level Pillars

1. **Conversation‑Driven Gameplay**  
2. **Fully Local AI** – Lean LLMs bundled with game; zero cloud setup.  
3. **Configurable Show Templates** – Engine exposes rules so new shows can be added via data files.  
4. **Scalable to P2P Multiplayer** – One player acts as *Host* node.  

## Gameplay Loop

Investigate → Converse → Deduce → Vote/Take Action → Resolve

### Core Mechanics

| Phase       | Player Actions                                                | AI Systems               |
| ----------- | ------------------------------------------------------------- | ------------------------ |
| Investigate | Walk around 3‑D house, eavesdrop                              | Per‑agent memory filter  |
| Converse    | Mic listens and broadcasts when within range of other players | LangGraph dialogue graph |
| Deduce      | Internal reasoning (human)                                    | n/a                      |
| Vote/Action | UI vote panel                                                 | AI votes via policy head |
| Resolve     | Cut‑scene results                                             | State broadcast          |

## Technical Stack

| Layer                | Tech |
| -------------------- | ---- |
| **Frontend**         | Electron + React‑Three‑Fiber |
| **Rendering**        | Low‑poly models, lo‑fi textures |
| **Audio**            | STT (Whisper or Nvidia Parakeet) → LLM (default Qwen 3 0.6 B; optional 1–2 B high‑quality pack; ≈4 GB VRAM for 0.6 B, 8–12 GB for 2 B) → TTS (likely Kokoro) |
| **AI Orchestration** | LangGraph (Python) |
| **Packaging**        | Electron Forge; Steam build |
| **Networking**       | None for v0; architecture kept flexible for future multiplayer |

### AI Agent Contract (JSON example)

    {
      "name": "Contestant_12",
      "role": "Faithful",
      "persona": {
        "openness": 0.65,
        "conscientiousness": 0.45,
        "extraversion": 0.70,
        "agreeableness": 0.55,
        "neuroticism": 0.30
      },
      "memory": [...],
      "pending_actions": []
    }

* Agents reason with single‑turn inference.  
* Memory capped to **N** messages; older items summarized.  

## Input/Output Pipeline

### Voice Path (default)

1. Client‑side **ASR** converts mic audio to text.  
2. Text + metadata sent to **Host LLM** (LangGraph).  
3. LLM returns reply text + emotion tag.  
4. Client renders **TTS** with matching voice preset and animation.  

### Text‑Chat Fallback (accessibility & testing)

1. Player types a message (global, proximity, DM).  
2. Message forwarded to Host LLM with `"user_text": true`.  
3. LLM returns reply text (+ emotion tag).  
4. UI shows speech balloon and optionally plays TTS.  

*Benefits*: microphone‑free play, support for speech‑impaired players, deterministic scripted tests.

## Show Template Schema (draft YAML)

    id: "survivor_core"
    phases:
      - name: "Camp"
        duration: 30m
        actions: ["converse", "search_idols"]
      - name: "TribalCouncil"
        duration: 10m
        actions: ["vote"]
    roles:
      - name: "Castaway"
        visibility: "public"
        win_condition: "be final player"
      - name: "TraitorRecruit"
        visibility: "hidden"
        win_condition: "survive until recruited"

## Roadmap

| Milestone | Features |
| --------- | -------- |
| **M0**    | Single‑player; *Traitors* minimal ruleset |
| **M0.5**  | **QA sprint**: load‑testing LangGraph memory caps & voice‑latency benchmarks |
| **M1**    | Local voice I/O; personality prompts |
| **M2**    | Template loader; mod support |
| **M3**    | P2P multiplayer (4–10 players) |
| **M4**    | Additional shows (*Survivor*, *Big Brother*) |

## Target Audience

* Reality‑TV fans seeking interactive experience.  
* Casual PC gamers; target spec: Intel i5‑9600 / GTX 1060.  

## Open Questions

1. Distributed inference for multi‑way conversations.  
2. Anti‑cheat / memory leaks in PvP.  
3. Packaging size vs. model quality.  

## Inspirations

* *Among Us* – simplicity  
* *The Traitors* – social deduction  
* *SpyParty* – one‑on‑one tension  

### Quick Reference (for LLMs)

    {
      "title": "Reality Show Simulator",
      "gameplay_focus": "conversation, social deduction",
      "ai_stack": {
        "orchestration": "LangGraph",
        "local_models": true,
        "voice": "STT->LLM->TTS or omni"
      },
      "platforms": ["Windows", "macOS", "Linux"],
      "mode": ["singleplayer v0", "p2p multiplayer (future)"]
    }

## Networking Strategy

### v0 Scope – Single‑Player Only

Networking is **explicitly out of scope** for the initial public prototype. All gameplay logic, LangGraph orchestration, ASR, TTS, and LLM inference execute entirely on the local host. Goal: rock‑solid solo experience.

### Designing for Future Multiplayer (v1+)

* **Separation of Concerns** – Authoritative game‑state mutations live in a serializable Command/Event Bus (JSON).  
* **Interface** – Each contestant’s AI pipeline behind `IAgentService` (local vs. remote).  
* **Event Sourcing / CRDTs** – Immutable logs for deterministic replay.  
* **Transport‑Agnostic Layer** – `ITransport` adapter for single‑process, LAN P2P, or server.  
* **Bandwidth Budgets** – Transmit only finalized conversational turns or LangGraph node transitions, not raw audio.  

> **Code‑Review Rule:** Any change that ties gameplay to local‑process state or blocks replication raises a red flag.
