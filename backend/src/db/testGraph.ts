import { driver } from "./connection";

async function createTestGraph() {
  const session = driver.session();

  try {
    const result = await session.run(`
      CREATE (service:Service {name: "Payment Service"})
      CREATE (database:Resource {
        name: "Payment Database",
        type: "PostgreSQL",
        provider: "AWS"
      })
      CREATE (service)-[:USES]->(database)
      RETURN service, database
    `);

    console.log("Service:", result.records[0].get("service").properties);
    console.log("Resource:", result.records[0].get("database").properties);
  } catch (error) {
    console.error("Failed to create test graph:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

createTestGraph();