import { google } from 'googleapis';

const sheets = google.sheets('v4');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = '1PIfNRjN58hxDGa3O8SrGKrM72n8ybPaHCcqPFZhgl1c';
const SHEET_NAME = 'Sheet1';

export async function getAuthToken() {
  try {
    const opts = {
      scopes: SCOPES
    }

    if (process.env.ENVIRONMENT === 'development')
      opts.keyFile = './creds.json'

    const auth = new google.auth.GoogleAuth(opts);
    const authToken = await auth.getClient();
    return authToken;
  } catch (e) {
    console.error('Failed to get google auth token.')
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

    const values = data.values.map(([value]) => value)
    
    return values;
  } catch (e) {
    console.error('Failed to get sheet values.')
    throw e;
  }
}

export async function appendSheetValues({ auth, data }) {
  const resource = { values: [[data]] };
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
    console.error('Failed to append sheet values.')
    throw e;
  }
}
