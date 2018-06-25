import { FETCH_INVOICES, FETCH_INVOICES_SUCCESS, FETCH_INVOICES_ERROR, 
  TOGGLE_INVOICE, TOGGLE_ALL_INVOICES, CHANGE_PAYMENT_AMOUNT, CHANGE_ADHOC_PAYMENT } from '../action-types/invoice';

export const fetchInvoices = (currencyCode) => {

  return async dispatch => {
    try {
      dispatch({
        type: FETCH_INVOICES
      })

      let token = localStorage.getItem('token');
      let code = localStorage.getItem('code');
      const response = await fetch(`${process.env.REACT_APP_API_INVOICES_URL}?token=${token}&code=${code}&currency=${currencyCode}`)
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

export const changePaymentAmount = (invoiceNumber, paymentAmount) => {
  return dispatch => {
    dispatch({type: CHANGE_PAYMENT_AMOUNT, payload: {invoiceNumber, paymentAmount}});
  }
}

export const changeAdhocAmount = (adhocPaymentEnabled, adhocPayment) => {
  return dispatch => {
    dispatch({type: CHANGE_ADHOC_PAYMENT, payload: {adhocPaymentEnabled, adhocPayment}});
  }
}