// actors.ts

export interface AgentMeta {
  key: string;
  name: string;
  persona: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  backstory: string;
}

/** List of in-game agents with their Big-5 scores & backstories */
export const AGENTS: AgentMeta[] = [
  {
    key: "agent_alice",
    name: "Alice",
    persona: {
      openness: 0.65,
      conscientiousness: 0.45,
      extraversion: 0.70,
      agreeableness: 0.55,
      neuroticism: 0.30,
    },
    backstory: "Grew up in the countryside; trusts no one.",
  },
  {
    key: "agent_bob",
    name: "Bob",
    persona: {
      openness: 0.30,
      conscientiousness: 0.80,
      extraversion: 0.50,
      agreeableness: 0.40,
      neuroticism: 0.20,
    },
    backstory: "Former detective; always probing for inconsistencies.",
  },
];
