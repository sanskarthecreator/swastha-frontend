export type ChronicCondition = 
  | "PCOS & Insulin Resistance"
  | "Type-2 Diabetes"
  | "IBS & Gut Health"
  | "Hypertension"
  | "Celiac Disease"
  | "Thyroid Disorders"
  | "Fatty Liver"
  | "Chronic Kidney Disease"
  | "Heart Disease"
  | "Lactose Intolerance"
  | "Gout & Uric Acid"
  | "General Wellness";

export interface ScanResult {
  id: string;
  timestamp: string;
  productName: string;
  image: string;
  rating: "green" | "yellow" | "red";
  conditions: ChronicCondition[];
  summary: string;
  warnings: {
    name: string;
    explanation: string;
  }[];
  alternatives: {
    name: string;
    reason: string;
    link?: string;
  }[];
  nutrients: {
    label: string;
    value: string;
    impact: "positive" | "negative" | "neutral";
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  conditions: ChronicCondition[];
  avatar?: string;
}
