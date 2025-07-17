const leagueId = "1180159914080931840";
const queryParams = new URLSearchParams(window.location.search);
const rosterId = parseInt(queryParams.get("roster_id"));

async function loadTeamPage() {
  try {
    const [usersRes, rostersRes, playersRes, leagueRes] = await Promise.all([
      fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
      fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
      fetch("https://api.sleeper.app/v1/players/nfl"),
      fetch(`https://api.sleeper.app/v1/league/${leagueId}`)
    ]);

    const users = await usersRes.json();
    const rosters = await rostersRes.json();
    const players = await playersRes.json();
    const league = await leagueRes.json();

    const roster = rosters.find(r => r.roster_id === rosterId);
    if (!roster) {
      throw new Error("Roster not found");
    }

    const user = users.find(u => u.user_id === roster.owner_id);
    const displayName = user ? user.display_name : "Unknown Manager";

    document.getElementById("team-name").textContent = roster.metadata.team_name || displayName;
    document.getElementById("owner-name").textContent = displayName;

    const tableBody = document.querySelector("#player-table tbody");
    tableBody.innerHTML = "";

    const playerIds = Array.isArray(roster.players) ? roster.players : [];

    playerIds.forEach(playerId => {
      const player = players[playerId];
      if (!player) return;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${player.full_name || player.first_name + " " + player.last_name}</td>
        <td>${player.position}</td>
        <td>${player.team}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading team data:", error);
    document.getElementById("team-name").textContent = "Error loading team";
  }
}

loadTeamPage();
