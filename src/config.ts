import { totalConsumption } from "./helpers";
import dotenv from "dotenv";

dotenv.config();

export interface IModbusConnection {
  mbsId: number;
  mbsPort: number;
  mbsHost: string;
  mbsScan: number;
  mbsTimeout: number;
}

export const connection: IModbusConnection = {
  mbsId: parseInt(process.env.MODBUS_ID as string, 10) || 1,
  mbsPort: parseInt(process.env.MODBUS_PORT as string, 10) || 502,
  mbsHost: process.env.MODBUS_HOST || "127.0.0.1",
  mbsScan: parseInt(process.env.MODBUS_SCAN as string, 10) || 100,
  mbsTimeout: parseInt(process.env.MODBUS_TIMEPUT as string, 10) || 5000,
};

export interface IRegister {
  name: string;
  register?: number;
  length?: number;
  lastValue: number;
  display: boolean;
  type?: string;
  unit?: string;
  negative?: string;
  positive?: string;
  func?: (registers: IRegister[]) => number;
  displayUnit?: string;
  math?: number;
}

export interface IRegisters extends Array<IRegister> {}

export const registers: IRegisters = [
  {
    name: "Power factor",
    register: 32084,
    length: 18,
    lastValue: 0,
    display: false,
  },
  { name: "Temp", register: 32087, length: 2, lastValue: 0, display: false },
  {
    name: "Device status",
    register: 32089,
    length: 2,
    lastValue: 0,
    display: false,
  },
  {
    name: "active power",
    type: "solar",
    register: 32080,
    length: 2,
    lastValue: 0,
    unit: "W",
    displayUnit: "kW",
    math: 0.001,
    display: true,
  },
  {
    name: "reactive power",
    register: 32082,
    length: 2,
    lastValue: 0,
    display: false,
  },
  {
    name: "grid",
    type: "grid",
    register: 37113,
    length: 9,
    lastValue: 0,
    unit: "W",
    displayUnit: "kW",
    math: 0.001,
    display: true,
    negative: "From Grid",
    positive: "To Grid",
  },
  {
    name: "phase A",
    type: "localGrid",
    register: 37132,
    length: 9,
    lastValue: 0,
    unit: "W",
    displayUnit: "kW",
    display: true,
    math: 0.001,
    negative: "From Grid",
    positive: "To Grid",
  },
  {
    name: "phase B",
    type: "localGrid",
    register: 37134,
    length: 9,
    lastValue: 0,
    unit: "W",
    displayUnit: "kW",
    display: true,
    math: 0.001,
    negative: "From Grid",
    positive: "To Grid",
  },
  {
    name: "phase C",
    type: "localGrid",
    register: 37136,
    length: 9,
    lastValue: 0,
    unit: "W",
    displayUnit: "kW",
    display: true,
    math: 0.001,
    negative: "From Grid",
    positive: "To Grid",
  },
  {
    name: "input power",
    type: "solar",
    register: 32064,
    length: 2,
    lastValue: 0,
    unit: "W",
    displayUnit: "kW",
    display: true,
    math: 0.001,
  },
  {
    name: "Acumulated Yield energy",
    register: 32106,
    length: 18,
    display: false,
    lastValue: 0,
  },
  {
    name: "Total house consumption",
    lastValue: 0,
    type: "func",
    func: totalConsumption,
    displayUnit: "kW",
    display: true,
    math: 0.001,
  },
];
