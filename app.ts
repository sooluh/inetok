import * as path from "path";
import player from "play-sound";
import * as dns from "dns/promises";
import type { ChildProcess } from "child_process";

// @ts-ignore
const playerInstance = player({ player: "cvlc" });
const soundFile = path.resolve(__dirname, "alert.wav");

let audio: ChildProcess | null = null;

function down() {
  console.log("Internet is down. Playing sound ...");

  // @ts-ignore
  audio = playerInstance.play(soundFile, { cvlc: ["-L"] }, (error: any) => {
    if (error) {
      console.error("Error playing sound:", error);
    }
  });
}

async function isOnline() {
  try {
    await Promise.race([
      dns.lookup("google.com"),
      new Promise((_, reject) => setTimeout(() => reject(false), 5_200)),
    ]);

    return true;
  } catch (error) {
    return false;
  }
}

async function monitor() {
  const isOnlineStatus = await isOnline();
  audio && audio.kill();

  if (isOnlineStatus) {
    console.log("Internet is online.");
  } else {
    down();
  }

  setTimeout(monitor, 1_300);
}

monitor();
