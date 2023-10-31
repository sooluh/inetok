import * as ping from "ping";
import * as path from "path";
import player from "play-sound";
import type { ChildProcess } from "child_process";

// @ts-ignore
const playerInstance = player({ player: "cvlc" });
const soundFile = path.resolve(__dirname, "alert.wav");

let counter = 0;
let audio: ChildProcess | null = null;

async function monitor() {
  const inet = await ping.promise.probe("1.1.1.1");
  audio && audio.kill();

  if (inet.alive) {
    counter = 0;
    console.log("Internet is online");
  } else {
    counter += 1;
    console.log(`Internet is down (${counter}x)`);

    if (counter > 5) {
      // @ts-ignore
      audio = playerInstance.play(soundFile, { cvlc: ["-L"] }, (error: any) => {
        if (error) {
          console.error("Error playing sound:", error);
        }
      });
    }
  }

  setTimeout(monitor, 1_000);
}

monitor();
