import { driver } from "./connection";

async function readGraph() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (service:Service)-[relationship:USES]->(resource:Resource)
      RETURN service, relationship, resource
    `);

    for (const record of result.records) {
      const service = record.get("service");
      const relationship = record.get("relationship");
      const resource = record.get("resource");

      console.log(
        `${service.properties.name} -[${relationship.type}]-> ${resource.properties.name}`
      );
    }
  } catch (error) {
    console.error("Failed to read graph:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

readGraph();