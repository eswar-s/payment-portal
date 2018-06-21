import { FETCH_INVOICES, FETCH_INVOICES_SUCCESS, FETCH_INVOICES_ERROR, TOGGLE_INVOICE, TOGGLE_ALL_INVOICES } from '../action-types/invoice';

const initialState = {
  fetching: false,
  invoices: [],
  error: ''
}

export default (state = initialState, action) => {
  switch(action.type) {
    case FETCH_INVOICES:
      return { ...state, fetching: true};
    case FETCH_INVOICES_SUCCESS:
      return { ...state, fetching: false, invoices: action.payload, error: '' };
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
    default:
      return state
  }
}
