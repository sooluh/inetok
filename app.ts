import * as ping from "ping";
import * as path from "path";
import player from "play-sound";
import type { ChildProcess } from "child_process";

// @ts-ignore
const playerInstance = player({ player: "cvlc" });
const soundFile = path.resolve(__dirname, "alert.wav");

let audio: ChildProcess | null = null;

async function monitor() {
  const online = await ping.promise.probe("1.1.1.1");
  audio && audio.kill();

  if (online.alive) {
    console.log("Internet is online.");
  } else {
    console.log("Internet is down. Playing sound ...");

    // @ts-ignore
    audio = playerInstance.play(soundFile, { cvlc: ["-L"] }, (error: any) => {
      if (error) {
        console.error("Error playing sound:", error);
      }
    });
  }

  setTimeout(monitor, 1_000);
}

monitor();
