import { google } from 'googleapis';

const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = '1cU3qggjDDtFwQC_sBUo06SNNTwyHMW48M_P0btrgIu8';
const SHEET_NAME = 'Sheet1';

export async function getAuthToken() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: SCOPES
    });
    const authToken = await auth.getClient();
    return authToken;
  } catch (e) {
    console.log('Failed to get google auth token.')
    throw e;
  }
}

export async function getSheetValues({ auth }) {
  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      auth,
      range: SHEET_NAME,
    });
    return data;
  } catch (e) {
    console.log('Failed to get sheet values.')
    throw e;
  }
}

export async function appendSheetValues({ auth, data }) {
  const resource = { values: [data] };
  console.log('appending values to sheet:', resource);
  try {
    const data = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      auth,
      range: SHEET_NAME,
      resource,
      valueInputOption: 'RAW',
    });
    return data.config.data.values;
  } catch (e) {
    console.log('Failed to append sheet values.')
    throw e;
  }
}
