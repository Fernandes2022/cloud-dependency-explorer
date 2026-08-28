import { driver } from "../db/connection";

export async function getServices() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (service:Service)
      RETURN service
      ORDER BY service.name
    `);

    return result.records.map((record) => {
      const service = record.get("service");

      return service.properties;
    });
  } finally {
    await session.close();
  }
}

export async function getServiceByName(name: string) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (service:Service {name: $name})
      RETURN service
      `,
      { name }
    );

    if (result.records.length === 0) {
      return null;
    }

    return result.records[0].get("service").properties;
  } finally {
    await session.close();
  }
}

export async function getServiceDependencies(name: string) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (service:Service {name: $name})
            -[:DEPENDS_ON]->
            (dependency:Service)
      RETURN dependency
      ORDER BY dependency.name
      `,
      { name }
    );

    return result.records.map((record) => {
      return record.get("dependency").properties;
    });
  } finally {
    await session.close();
  }
}

export async function getResourceImpact(resourceName: string) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH
        (resource:Resource {name: $resourceName})
        <-[:USES]-
        (directService:Service)

      OPTIONAL MATCH
        (affected:Service)
        -[:DEPENDS_ON*1..]->
        (directService)

      RETURN DISTINCT affected
      `,
      { resourceName }
    );

    return result.records
      .map((record) => record.get("affected"))
      .filter(Boolean)
      .map((service) => service.properties);
  } finally {
    await session.close();
  }
}


export async function getServiceGraph(name: string) {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (service:Service {name: $name})

      OPTIONAL MATCH path =
        (service)-[:DEPENDS_ON|USES|DEPLOYED_TO|OWNED_BY*1..2]->(connected)

      WITH service, collect(DISTINCT connected) AS connectedNodes,
           collect(DISTINCT path) AS paths

      RETURN
        service,
        connectedNodes,
        paths
      `,
      { name }
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    const service = record.get("service");
    const connectedNodes = record.get("connectedNodes");

    const nodes = [
      service,
      ...connectedNodes.filter(Boolean),
    ].map((node) => ({
      id: node.elementId,
      labels: node.labels,
      properties: node.properties,
    }));

    const edges = new Map<
      string,
      {
        id: string;
        source: string;
        target: string;
        type: string;
      }
    >();

    for (const path of record.get("paths") ?? []) {
      if (!path?.segments) continue;

      for (const segment of path.segments) {
        const relationship = segment.relationship;
        const id = relationship.elementId;

        edges.set(id, {
          id,
          source: relationship.startNodeElementId,
          target: relationship.endNodeElementId,
          type: relationship.type,
        });
      }
    }

    return {
      nodes,
      edges: Array.from(edges.values()),
    };
  } finally {
    await session.close();
  }
}