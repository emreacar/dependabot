export type SendMailParams = {
  to: string;
  subject: string;
  template: string;
  context: Record<any, any>;
};
