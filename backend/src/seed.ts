import { driver } from "./db/connection";

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("Starting database seed...");

    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);

    // -----------------------------
    // Services
    // -----------------------------

    await session.run(`
      UNWIND $services AS service
      MERGE (s:Service {name: service.name})
      SET
        s.language = service.language,
        s.status = service.status
    `, {
      services: [
        {
          name: "API Gateway",
          language: "Node.js",
          status: "healthy",
        },
        {
          name: "Auth Service",
          language: "Node.js",
          status: "healthy",
        },
        {
          name: "User Service",
          language: "TypeScript",
          status: "healthy",
        },
        {
          name: "Payment Service",
          language: "Node.js",
          status: "healthy",
        },
        {
          name: "Order Service",
          language: "TypeScript",
          status: "healthy",
        },
        {
          name: "Notification Service",
          language: "Node.js",
          status: "healthy",
        },
      ],
    });

    // -----------------------------
    // Resources
    // -----------------------------

    await session.run(`
      UNWIND $resources AS resource
      MERGE (r:Resource {name: resource.name})
      SET
        r.type = resource.type,
        r.provider = resource.provider
    `, {
      resources: [
        {
          name: "Redis",
          type: "Cache",
          provider: "AWS",
        },
        {
          name: "User Database",
          type: "PostgreSQL",
          provider: "AWS",
        },
        {
          name: "Payment Database",
          type: "PostgreSQL",
          provider: "AWS",
        },
        {
          name: "Order Database",
          type: "PostgreSQL",
          provider: "AWS",
        },
        {
          name: "Notification Queue",
          type: "Message Queue",
          provider: "AWS",
        },
      ],
    });

    // -----------------------------
    // Teams
    // -----------------------------

    await session.run(`
      UNWIND $teams AS team
      MERGE (t:Team {name: team})
    `, {
      teams: [
        "Platform Team",
        "Identity Team",
        "Users Team",
        "Payments Team",
        "Orders Team",
        "Notifications Team",
      ],
    });

    // -----------------------------
    // Environments
    // -----------------------------

    await session.run(`
      UNWIND $environments AS environment
      MERGE (e:Environment {name: environment})
    `, {
      environments: [
        "Development",
        "Staging",
        "Production",
      ],
    });

    // -----------------------------
    // Service dependencies
    // -----------------------------

    await session.run(`
      UNWIND $dependencies AS dependency
      MATCH (source:Service {name: dependency.source})
      MATCH (target:Service {name: dependency.target})
      MERGE (source)-[:DEPENDS_ON]->(target)
    `, {
      dependencies: [
        {
          source: "API Gateway",
          target: "Auth Service",
        },
        {
          source: "API Gateway",
          target: "User Service",
        },
        {
          source: "API Gateway",
          target: "Payment Service",
        },
        {
          source: "API Gateway",
          target: "Order Service",
        },
        {
          source: "Payment Service",
          target: "Auth Service",
        },
        {
          source: "Order Service",
          target: "Payment Service",
        },
      ],
    });

    // -----------------------------
    // Service resources
    // -----------------------------

    await session.run(`
      UNWIND $usages AS usage
      MATCH (service:Service {name: usage.service})
      MATCH (resource:Resource {name: usage.resource})
      MERGE (service)-[:USES]->(resource)
    `, {
      usages: [
        {
          service: "Auth Service",
          resource: "Redis",
        },
        {
          service: "User Service",
          resource: "User Database",
        },
        {
          service: "Payment Service",
          resource: "Payment Database",
        },
        {
          service: "Payment Service",
          resource: "Redis",
        },
        {
          service: "Order Service",
          resource: "Order Database",
        },
        {
          service: "Notification Service",
          resource: "Notification Queue",
        },
      ],
    });

    // -----------------------------
    // Service ownership
    // -----------------------------

    await session.run(`
      UNWIND $ownerships AS ownership
      MATCH (service:Service {name: ownership.service})
      MATCH (team:Team {name: ownership.team})
      MERGE (service)-[:OWNED_BY]->(team)
    `, {
      ownerships: [
        {
          service: "API Gateway",
          team: "Platform Team",
        },
        {
          service: "Auth Service",
          team: "Identity Team",
        },
        {
          service: "User Service",
          team: "Users Team",
        },
        {
          service: "Payment Service",
          team: "Payments Team",
        },
        {
          service: "Order Service",
          team: "Orders Team",
        },
        {
          service: "Notification Service",
          team: "Notifications Team",
        },
      ],
    });

    // -----------------------------
    // Service environments
    // -----------------------------

    await session.run(`
      UNWIND $deployments AS deployment
      MATCH (service:Service {name: deployment.service})
      MATCH (environment:Environment {name: deployment.environment})
      MERGE (service)-[:DEPLOYED_TO]->(environment)
    `, {
      deployments: [
        {
          service: "API Gateway",
          environment: "Production",
        },
        {
          service: "Auth Service",
          environment: "Production",
        },
        {
          service: "User Service",
          environment: "Production",
        },
        {
          service: "Payment Service",
          environment: "Production",
        },
        {
          service: "Order Service",
          environment: "Production",
        },
        {
          service: "Notification Service",
          environment: "Production",
        },
      ],
    });

    // -----------------------------
    // Deployment records
    // -----------------------------

    await session.run(`
      UNWIND $deployments AS deployment
      MERGE (d:Deployment {version: deployment.version})
      SET d.deployedAt = deployment.deployedAt

      WITH d, deployment
      MATCH (service:Service {name: deployment.service})
      MERGE (d)-[:DEPLOYS]->(service)
    `, {
      deployments: [
        {
          version: "api-gateway-v1.3.0",
          service: "API Gateway",
          deployedAt: "2026-08-25",
        },
        {
          version: "auth-service-v2.1.0",
          service: "Auth Service",
          deployedAt: "2026-08-24",
        },
        {
          version: "user-service-v1.8.0",
          service: "User Service",
          deployedAt: "2026-08-23",
        },
        {
          version: "payment-service-v1.4.2",
          service: "Payment Service",
          deployedAt: "2026-08-26",
        },
        {
          version: "order-service-v3.0.1",
          service: "Order Service",
          deployedAt: "2026-08-26",
        },
        {
          version: "notification-service-v1.2.4",
          service: "Notification Service",
          deployedAt: "2026-08-22",
        },
      ],
    });

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();