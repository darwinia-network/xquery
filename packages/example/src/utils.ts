import axios from 'axios';

export async function fetch(
  url: string | undefined,
  queryStr: string,
  field: string
): Promise<any> {
  if (url === undefined) {
    return undefined;
  }
  try {
    let resp = await axios.post(url, { query: queryStr });

    return resp.data?.data?.query[field];
  } catch (error) {
    return error;
  }
}
