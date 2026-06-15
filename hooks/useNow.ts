"use client";

import { useContext } from "react";
import { NowContext } from "@/components/time/NowProvider";

/** Trusted current time (server-synced). Use for lock checks, never `new Date()`. */
export const useNow = () => useContext(NowContext);
