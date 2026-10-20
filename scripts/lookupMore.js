async function test() {
  const q = `
  query {
    saitama: Character(search: "Saitama") { name { full } image { large } }
    naruto: Character(search: "Naruto Uzumaki") { name { full } image { large } }
    ichigo: Character(search: "Ichigo Kurosaki") { name { full } image { large } }
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
