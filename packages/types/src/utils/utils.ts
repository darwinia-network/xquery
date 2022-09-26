// Copyright 2021-2022 Darwinia Network authors & contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';

export async function fetchGraphqlData(
  url: string | undefined,
  queryStr: string,
  field: string
): Promise<unknown> {
  if (url === undefined) {
    return undefined;
  }
  try {
    const resp = await axios.post(url, { query: queryStr });

    // graphql querying response
    return resp.data?.data?.query[field];
  } catch (error) {
    console.log(error);
  }
}

export async function sleep(sec: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000);
  });
}
