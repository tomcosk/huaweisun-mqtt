import ModbusRTU from "modbus-serial";
import { IModbusConnection, IRegister, IRegisters, registers } from "./config";

export const readData = async (client: any, register: IRegister) => {
  if (register.display) {
    // console.log(register);
    if (register.func instanceof Function) {
      register.lastValue = register.func(registers);
      return `${register.name.padEnd(findLongestName(registers) + 3, " ")} ${
        register.math
          ? Math.round(register.func(registers) * register.math * 1000) / 1000
          : register.func(registers)
      } ${register.displayUnit ? register.displayUnit : ""}`;
    } else {
      // try to read data
      try {
        const data = await client.readHoldingRegisters(
          register.register,
          register.length
        );

        register.lastValue = data.buffer.readInt32BE(0);

        return `${register.name.padEnd(findLongestName(registers) + 3, " ")} ${
          register.math
            ? Math.round(register.lastValue * register.math * 1000) / 1000
            : register.lastValue
        } ${register.displayUnit ? register.displayUnit : ""}`;
      } catch (e: any) {
        return `${register.name.padEnd(findLongestName(registers) + 3, " ")} ${
          e.message
        }`;
      }
    }
  } else {
    return "";
    // console.log(`${register.name} skipping`);
  }
};

const findLongestName = (registers: IRegister[]) => {
  let maxLength = 0;
  const reg = registers
    .filter((item: IRegister) => item.display)
    .forEach((item: any) => {
      if (item.name.length > maxLength) {
        maxLength = item.name.length;
      }
    });
  return maxLength;
};

export const totalConsumption = (registers: IRegister[]) => {
  const phases = registers.filter(
    (item: IRegister) => item.type === "localGrid"
  );

  let phasesTogether = 0;
  phases.forEach((phase) => {
    phasesTogether += phase.lastValue;
  });
  let consumption = 0;
  const solar = registers.find(
    (item: IRegister) => item.type && item.type === "solar"
  );
  if (phasesTogether < 0) {
    if (solar) {
      consumption = solar.lastValue - phasesTogether;
    }
  } else {
    if (solar) {
      consumption = solar.lastValue + phasesTogether;
    }
  }
  return consumption;
};

export const clientConneect = async (
  client: ModbusRTU,
  config: IModbusConnection
) => {
  try {
    const { mbsHost, mbsPort } = config;
    await client.connectTCP(mbsHost, { port: mbsPort });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
