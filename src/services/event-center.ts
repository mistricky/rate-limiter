import crypto from "crypto";
import { Time } from "./time";
import { Redis } from "./redis";

export interface Event {
  name: string;
  limitCount: number;
  rate: number; // unit is <s>
}

export class EventCenter {
  private _event: Event;

  constructor(event: Event) {
    this._event = event;
  }

  get event(): Event {
    return this._event;
  }

  get eventID(): string {
    const { limitCount, name, rate } = this.event;

    return crypto
      .createHash("sha256")
      .update(limitCount + name + rate)
      .digest("hex");
  }

  private get hashFields(): (string | number)[] {
    const { limitCount, name, rate } = this.event;
    const speed = rate / Time.Second;

    return [
      "cap",
      limitCount,
      "lastLeaveTime",
      Date.now(),
      "rate",
      speed,
      "remainCap",
      limitCount
    ];
  }

  init(): void {
    Redis.getClient().HMSET(this.eventID, ...this.hashFields);
  }
}
