import axios from 'axios';

export async function fetchGraphqlData(
  url: string | undefined,
  queryStr: string,
  field: string
): Promise<any> {
  if (url === undefined) {
    return undefined;
  }
  try {
    let resp = await axios.post(url, { query: queryStr });

    // graphql querying response
    return resp.data?.data?.query[field];
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function sleep(sec: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
}
