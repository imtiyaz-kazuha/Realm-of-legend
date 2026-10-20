async function test() {
  const q = `
  query {
    guts: Character(search: "Guts") { name { full } image { large } }
    jotaro: Character(search: "Jotaro") { name { full } image { large } }
    gojo: Character(search: "Satoru Gojou") { name { full } image { large } }
  }
  `;
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
