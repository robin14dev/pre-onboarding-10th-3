type SearchSuccssResponse = {
  opcode: number;
  message: string;
  data: {
    q: string;
    page: number;
    limit: number;
    result: string[];
    qty: number;
    total: number;
  };
};
