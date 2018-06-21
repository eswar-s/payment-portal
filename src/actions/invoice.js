import { FETCH_INVOICES, FETCH_INVOICES_SUCCESS, FETCH_INVOICES_ERROR, TOGGLE_INVOICE, TOGGLE_ALL_INVOICES } from '../action-types/invoice';

export const fetchInvoices = (currencyCode) => {

  return async dispatch => {
    try {
      dispatch({
        type: FETCH_INVOICES
      })

      let token = localStorage.getItem('token');
      let code = localStorage.getItem('code');
      const response = await fetch(`http://localhost:8080/get-customer-invoices?token=${token}&code=${code}&currency=${currencyCode}`)
      const data = await response.json();
      if (data.status === 'success') {
        dispatch({type: FETCH_INVOICES_SUCCESS, payload: data.invoices.map(invoice => {
          return {...invoice, selected: false}
        })})
      } else {
        dispatch({type: FETCH_INVOICES_ERROR, payload: data.message})
      }
    } catch(error) {
      dispatch({type: FETCH_INVOICES_ERROR, payload: 'Server unreachable, Please contact customer support'})
    }
  }
}

export const toggleInvoice = (invoiceNumber) => {
  return dispatch => {
    dispatch({type: TOGGLE_INVOICE, payload: invoiceNumber});
  }
}

export const toggleAllInvoices = (checked) => {
  return dispatch => {
    dispatch({type: TOGGLE_ALL_INVOICES, payload: checked});
  }
}