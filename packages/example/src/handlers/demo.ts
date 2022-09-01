interface a {
  isd: number;
}
interface b {
  id: string;
}

type c = a & b & { ent: string };

async function demo() {
  let cc: c = {
    id: 'Dwqd',
    ent: 'Dqwdw',
    isd: 112,
  };
}
