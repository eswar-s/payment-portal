import { FETCH_INVOICES, FETCH_INVOICES_SUCCESS, FETCH_INVOICES_ERROR, 
  TOGGLE_INVOICE, TOGGLE_ALL_INVOICES, CHANGE_PAYMENT_AMOUNT, CHANGE_ADHOC_PAYMENT } from '../action-types/invoice';

const initialState = {
  fetching: false,
  invoicesAndpaymentAmountsBeforeAdhoc: null,
  originalInvoices: [],
  invoices: [],
  paymentAmounts: {},
  adhocPaymentEnabled: false,
  adhocPayment: 0,
  error: ''
}

export default (state = initialState, action) => {
  switch(action.type) {
    case FETCH_INVOICES:
      return { ...state, fetching: true};
    case FETCH_INVOICES_SUCCESS:
      let paymentAmounts = {};
      action.payload.forEach(invoice => {
        paymentAmounts[invoice.invoiceNumber] = invoice.netAmount
      });
      return { ...state, fetching: false, invoices: action.payload, originalInvoices: action.payload, 
        paymentAmounts, error: '', adhocPaymentEnabled: false, adhocPayment: 0, invoicesAndpaymentAmountsBeforeAdhoc: null };
    case FETCH_INVOICES_ERROR:
      return { ...state, fetching: false, invoices: [], error: action.payload };
    case TOGGLE_INVOICE:
      return {...state, invoices: state.invoices.map(invoice => {
        if (invoice.invoiceNumber === action.payload) {
          return {...invoice, selected: !invoice.selected}
        }
        return {...invoice} 
      })};
    case TOGGLE_ALL_INVOICES:
      return {...state, invoices: state.invoices.map(invoice => {
        return {...invoice, selected: action.payload}
      })};
    case CHANGE_PAYMENT_AMOUNT:
      return {...state, paymentAmounts: {...state.paymentAmounts, [action.payload.invoiceNumber]: (+action.payload.paymentAmount)}}
    case CHANGE_ADHOC_PAYMENT:
      let adhocPaymentEnabled = action.payload.adhocPaymentEnabled;
      let adhocPayment = +action.payload.adhocPayment;
      let invoices = JSON.parse(JSON.stringify(state.originalInvoices));
      let newPaymentAmounts = {};
      let backup = {};
      if (adhocPaymentEnabled && !state.adhocPaymentEnabled) {
        backup = {invoicesAndpaymentAmountsBeforeAdhoc: {invoices: JSON.stringify(state.invoices), paymentAmounts: JSON.stringify(state.paymentAmounts)}}
      }
      if (adhocPaymentEnabled) {
        if (adhocPayment > 0) {
          let balance = adhocPayment;
          invoices.forEach(invoice => {
            if (balance > 0) {
              if (invoice.netAmount > balance) {
                invoice.paymentAmount = balance;
                newPaymentAmounts[invoice.invoiceNumber] = balance;
                balance = 0;
              } else {
                invoice.paymentAmount = invoice.netAmount;
                newPaymentAmounts[invoice.invoiceNumber] = invoice.netAmount;
                balance = balance - invoice.netAmount;
              }
              invoice.selected = true;
            }
          })
        }
        return {...state, adhocPaymentEnabled, adhocPayment, invoices, 
          paymentAmounts: {...state.paymentAmounts, ...newPaymentAmounts},
          ...backup
        }
      }
      return {...state, adhocPaymentEnabled, adhocPayment,
        invoices: JSON.parse(state.invoicesAndpaymentAmountsBeforeAdhoc.invoices),
        paymentAmounts: JSON.parse(state.invoicesAndpaymentAmountsBeforeAdhoc.paymentAmounts)
      }
    default:
      return state
  }
}
