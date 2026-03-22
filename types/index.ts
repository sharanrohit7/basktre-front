export interface WaitlistRequest {
  email: string;
}

export interface WaitlistResponse {
  message: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NavLink {
  label: string;
  href: string;
}
