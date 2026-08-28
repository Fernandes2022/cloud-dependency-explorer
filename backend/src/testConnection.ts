import { driver } from "./db/connection";

async function testConnection() {
  try {
    await driver.verifyConnectivity();

    console.log("Successfully connected to CognoDB");
  } catch (error) {
    console.error("Failed to connect to CognoDB");
    console.error(error);
  } finally {
    await driver.close();
  }
}

testConnection();