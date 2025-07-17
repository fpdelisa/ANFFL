const leagueId = '1180159914080931840';

async function loadStandings() {
  const rosterRes = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
  const userRes = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);

  const rosters = await rosterRes.json();
  const users = await userRes.json();

  const userMap = Object.fromEntries(users.map(u => [u.user_id, u.display_name]));
  const tbody = document.querySelector("#standings tbody");
  tbody.innerHTML = ''; // Clear any old data

  const rows = rosters.map(roster => {
    const ownerName = userMap[roster.owner_id] || "Unknown";
    const teamName = roster.metadata?.team_name || ownerName;
    const { wins, losses, fpts } = roster.settings;

    return { teamName, wins, losses, fpts };
  });

  // Sort by wins then points for
  rows.sort((a, b) => b.wins - a.wins || b.fpts - a.fpts);

  rows.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.teamName}</td>
      <td>${row.wins}</td>
      <td>${row.losses}</td>
      <td>${row.fpts}</td>
    `;
    tbody.appendChild(tr);
  });
}

loadStandings();
