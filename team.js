const leagueId = '1180159914080931840';

// Get URL parameter helper
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

async function loadTeam() {
  const rosterId = getQueryParam('roster_id');
  if (!rosterId) {
    alert("No roster_id specified in URL");
    return;
  }

  try {
    const [rosters, users, players] = await Promise.all([
      fetchJson(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
      fetchJson(`https://api.sleeper.app/v1/league/${leagueId}/users`),
      fetchJson('https://api.sleeper.app/v1/players/nfl')  // All NFL players, for names
    ]);

    const roster = rosters.find(r => r.roster_id === Number(rosterId));
    if (!roster) {
      alert("Roster not found");
      return;
    }

    const owner = users.find(u => u.user_id === roster.owner_id);
    const playerMap = Object.fromEntries(players.map(p => [p.player_id, p]))

    document.getElementById('team-name').textContent = roster.metadata?.team_name || "Unnamed Team";
    document.getElementById('manager-name').textContent = owner?.display_name || "Unknown Manager";

    const rosterList = document.getElementById('roster-list');
    rosterList.innerHTML = '';

    roster.players.forEach(playerId => {
      const player = playerMap[playerId];
      const li = document.createElement('li');
      li.textContent = player
        ? `${player.full_name} (${player.position}, ${player.team})`
        : playerId;
      rosterList.appendChild(li);
    });
  } catch (e) {
    alert("Error loading team data: " + e.message);
  }
}

loadTeam();
