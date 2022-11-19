const axios = require("axios");
const { knex } = require("../db");

const router = require("express-promise-router")();
module.exports = router;

async function updateMatchTeam(trx, fifaMatchId, teamData, column) {
  const fifaTeamId = teamData.IdTeam;

  const team = await trx("team")
    .select("id")
    .where({ fifa_id: fifaTeamId })
    .first();

  if (team === undefined) {
    throw new Error(`Could not find team with id: ${fifaTeamId}`);
  }

  const match = await trx("match")
    .select("id", column)
    .where({ fifa_id: fifaMatchId })
    .first();

  if (match === undefined) {
    throw new Error(`Could not find match with id: ${fifaMatchId}`);
  }

  if (match[column] !== null) {
    // team is already set -> skip it
    return false;
  }

  await trx("match")
    .update({ [column]: team.id })
    .where({ id: match.id });

  return true;
}

router.get("/autoupdate_match_teams", async (req, res) => {
  const matches = await knex("match")
    .select("id", "fifa_id")
    .whereRaw("home_team_id is null OR away_team_id is null");

  if (matches.length === 0) {
    res.json({
      ok: true,
      message: "No matches with missing teams to update",
    });
    return;
  }

  const { data } = await axios.get(
    "https://api.fifa.com/api/v3/calendar/matches?count=100&idSeason=255711"
  );
  const matchMap = new Map(data.Results.map((x) => [x.IdMatch, x]));

  const result = [];

  knex.transaction(function (trx) {
    return Promise.all([
      knex("foo").insert({ name: "My Name" }),
      knex("bar").insert({ field: "Value" }),
    ]);
    // ---- or something like ----
    return Promise.all(
      SOME_INPUT_VALUES.map(function (value) {
        return knex("foo_bar").update("lul", value.lul).where("id", value.id);
      })
    );
  });

  await knex.transaction(async (trx) => {
    for (const m of matches) {
      const matchData = matchMap.get(m.fifa_id);

      if (matchData === undefined) {
        result.push(`Match not found for id=${m.fifa_id}`);
        continue;
      }

      if (matchData.Home) {
        const ok = await updateMatchTeam(
          trx,
          m.fifa_id,
          matchData.Home,
          "home_team_id"
        );

        if (ok) {
          result.push(`Home team updated for match ${matchData.id}`);
        }
      }

      if (matchData.Away) {
        const ok = await updateMatchTeam(
          trx,
          m.fifa_id,
          matchData.Away,
          "away_team_id"
        );

        if (ok) {
          result.push(`Away team updated for match ${matchData.id}`);
        }
      }
    }
  });

  res.json({
    ok: true,
    result,
  });
});
