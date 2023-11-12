/* eslint-disable no-console, spaced-comment */
import { registers, connection } from "./config";
import { readData, clientConneect } from "./helpers";
import ModbusRTU from "modbus-serial";
import * as mqtt from "mqtt"; // import everything inside the mqtt module and give it the namespace "mqtt"

export async function RUN() {
  let clientMqtt = await mqtt.connectAsync({
    host: process.env.MQTT_HOST || "127.0.0.1",
    port: parseInt(process.env.MQTT_PORT as string, 10) || 1883,
    username: process.env.MQTT_USERNAME || undefined,
    password: process.env.MQTT_PASSWORD || undefined,
  });
  clientMqtt.publish(
    process.env.MQTT_TOPIC_LOG || "solar/log",
    "solar connected"
  );

  // Modbus TCP configuration values
  // create an empty modbus client
  // const ModbusRTU = require("modbus-serial");
  // const ModbusRTU = require("../index");
  const client = new ModbusRTU();

  // await connectClient();
  client.close(() => {
    console.log("Client closed");
  });
  // set requests parameters
  client.setID(connection.mbsId);
  client.setTimeout(connection.mbsTimeout);
  const isConnected = await clientConneect(client, connection);
  // await readData(client, registers[3]);
  // try to connect
  while (true) {
    let s = "";
    const jsn: any = {};
    for (const register of registers) {
      if (register.display) {
        s += await readData(client, register);
        s += "\n";
        jsn[register.name] = register.lastValue;
      }
    }
    clientMqtt.publish(
      process.env.MQTT_TOPIC || "solar/ATTR",
      JSON.stringify(jsn)
    );

    // console.log(`Total Consumption: `${registers[]})
    if (process.env.CONSOLE_DISPLAY === "true") {
      console.log(`----+===== ${new Date().toISOString()} ====+----`);
      console.log(s);
    }
  }
  return Promise.reject();
}

// RUN().catch((e) => {
//   console.log(e);
// });
