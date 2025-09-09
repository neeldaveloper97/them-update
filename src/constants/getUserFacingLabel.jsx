export const BillStatus = {
  UPLOADED: 'uploaded',
  PARSING: 'parsing',
  PARSE_FAILED: 'parse_failed',
  WAITING_USER_INPUT: 'waiting_user_input',
  USER_INPUT_RECEIVED: 'user_input_received',
  WAITING_PROVIDER_INPUT: 'waiting_provider_input',
  PROVIDER_INPUT_RECEIVED: 'provider_input_received',
  READY_FOR_NEGOTIATION: 'ready_for_negotiation',
  NEGOTIATION_INITIATED: 'negotiation_initiated',
};

export const getUserFacingLabel = (status) => {
  switch (status) {
    case BillStatus.WAITING_USER_INPUT:
      return 'Missing Details';
    case BillStatus.READY_FOR_NEGOTIATION:
      return 'Ready to Negotiate';
    case BillStatus.NEGOTIATION_INITIATED:
      return 'In Negotiation';
    case BillStatus.PARSE_FAILED:
      return 'Parse Failed';
    case BillStatus.USER_INPUT_RECEIVED:
    case BillStatus.WAITING_PROVIDER_INPUT:
    case BillStatus.PROVIDER_INPUT_RECEIVED:
      return 'Provider Review';
    case BillStatus.UPLOADED:
    case BillStatus.PARSING:
      return 'Pending';
    default:
      return 'Processing...';
  }
};
