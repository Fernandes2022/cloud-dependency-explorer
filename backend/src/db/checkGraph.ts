import { driver } from "./connection";

async function checkGraph() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (a)-[r]->(b)
      RETURN
        labels(a) AS fromLabels,
        properties(a) AS fromProperties,
        type(r) AS relationship,
        labels(b) AS toLabels,
        properties(b) AS toProperties
      ORDER BY relationship
    `);

    for (const record of result.records) {
      console.log({
        fromLabels: record.get("fromLabels"),
        fromProperties: record.get("fromProperties"),
        relationship: record.get("relationship"),
        toLabels: record.get("toLabels"),
        toProperties: record.get("toProperties"),
      });
    }
  } finally {
    await session.close();
    await driver.close();
  }
}

checkGraph();